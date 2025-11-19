import React from "react";
import { NavLink } from "react-router-dom";
import './styles/SidebarDesign.css'

const SideBar = () =>{
    return(
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Классификация сцен из фильмов</h2>
            </div>

            <ul className="paragraph-selector">
                <NavLink
                    to='/task-setting'
                    className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>
                        Постановка задачи
                </NavLink>

                <NavLink
                    to='/modelling'
                    className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>
                        Моделирование
                </NavLink>

                <NavLink
                    to='/integration'
                    className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>
                        Интеграция
                </NavLink>

                <NavLink
                    to='/posts'
                    className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>    
                        Посты
                </NavLink>

                <NavLink
                    to='/api'
                    className={({isActive}) => isActive ? 'nav-button active' : 'nav-button'}>
                        API
                </NavLink>
                {/* <button onClick={() => selectParagraph('постановка задачи')}>Постановка задачи</button>
                <button onClick={() => selectParagraph('моделирование')}>Моделирование</button>
                <button onClick={() => selectParagraph('внедрение')}>Внедрение</button> */}
            </ul>
        </div>
    )
}

export default SideBar;