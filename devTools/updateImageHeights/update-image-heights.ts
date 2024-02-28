import { imageStore } from "../../db/model/Image.js"
import * as db from "../../db/db.js"
import { exit } from "../../db/cleanup.js"

async function updateImageHeights() {
    const transaction = await db.knexInstance().transaction()
    const filenames = await db
        .knexRaw<{ filename: string }>(
            `SELECT filename
            FROM posts_gdocs_x_images pgxi
            LEFT JOIN images i ON pgxi.imageId = i.id`,
            transaction
        )
        .then((rows) => rows.map((row) => row.filename))

    console.log("Fetching image metadata...")
    await imageStore.fetchImageMetadata([])
    console.log("Fetching image metadata...done")

    if (!imageStore.images) {
        throw new Error("No images found")
    }

    console.log("Batching image metadata...")
    const batches = filenames.reduce<string[][]>(
        (acc, filename) => {
            const lastBatch = acc[acc.length - 1]
            if (lastBatch.length === 20) {
                acc.push([filename])
            } else {
                lastBatch.push(filename)
            }
            return acc
        },
        [[]]
    )
    console.log("Batching image metadata...done")

    let imagesWithoutOriginalHeight = []
    try {
        let index = 0
        for (const batch of batches) {
            const promises = []
            for (const filename of batch) {
                const image = imageStore.images[filename]
                if (image && image.originalHeight) {
                    promises.push(
                        db.knexRaw(
                            `
                            UPDATE images
                            SET originalHeight = ?
                            WHERE filename = ?
                        `,
                            transaction,
                            [image.originalHeight, filename]
                        )
                    )
                } else {
                    console.error(`No original height found for ${filename}`)
                    imagesWithoutOriginalHeight.push(filename)
                }
            }
            console.log(`Updating image heights for batch ${index}...`)
            await Promise.all(promises)
            console.log(`Updating image heights for batch ${index}...done`)
            index++
        }
        await transaction.commit()
        console.log("All image heights updated successfully!")
        // Most likely due to the original file being deleted but the DB not being updated, each of these will need to be manually checked
        console.log(
            "Images without original height:",
            imagesWithoutOriginalHeight
        )
        await exit()
    } catch (error) {
        console.error(error)
        await transaction.rollback()
        await exit()
    }
}

updateImageHeights()
