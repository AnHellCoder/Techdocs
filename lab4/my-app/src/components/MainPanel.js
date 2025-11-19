import React from "react";
import './styles/MainPanelDesign.css';

const MainPanel = ({content}) => {
    return(
        <div className="main-panel">
            {content}
        </div>
    )
}

export default MainPanel;