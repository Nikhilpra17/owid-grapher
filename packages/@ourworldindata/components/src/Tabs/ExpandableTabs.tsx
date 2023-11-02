import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index.js"
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"
import { Tabs } from "./Tabs"

export const ExpandableTabs = ({
    labels,
    activeIndex,
    setActiveIndex,
    isExpandedDefault = false,
    getVisibleLabels = (labels: string[]) => labels.slice(0, 3),
}: {
    labels: string[]
    activeIndex: number
    setActiveIndex: (index: number) => void
    isExpandedDefault?: boolean
    getVisibleLabels?: (tabLabels: string[]) => string[]
}) => {
    const [isExpanded, setExpanded] = useState(isExpandedDefault)

    const toggle = () => {
        setExpanded(!isExpanded)
    }

    const visibleLabels = isExpanded ? labels : getVisibleLabels(labels)

    return (
        <Tabs
            labels={visibleLabels}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            slot={
                <button
                    className="Tabs__tab ExpandableTabs__button"
                    onClick={toggle}
                >
                    <FontAwesomeIcon icon={isExpanded ? faMinus : faPlus} />
                    <span>{isExpanded ? "Show less" : "Show more"}</span>
                </button>
            }
        />
    )
}
