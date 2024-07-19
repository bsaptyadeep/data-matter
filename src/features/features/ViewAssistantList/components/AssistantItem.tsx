import { IconButton } from '@mui/material'
import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import css from './AssistantItem.module.css';
import { IAssistant } from '../../../Data';
import { useNavigate } from 'react-router-dom';

interface IProps {
    assistant: IAssistant
}

const AssistantItem = (props: IProps) => {
    const navigate = useNavigate()
    const [isExpandedView, setIsExpandedView] = useState<boolean>(false)

    return (
        <div className={css.assistantListItemContainer}>
            <div
                className={`${css.assistantListItem} ${css.addAssistantButton}`}>
                <div className={css.assistantItemLeft}>
                    <h3>{props.assistant.name}</h3>
                </div>
                <div className={css.assistantItemRight}>
                    <button
                        className={css.assistantItemButton}
                        onClick={() => {
                            navigate(`/chat?assistant_id=${props.assistant._id}`)
                        }}
                    >
                        Open
                    </button>
                    <IconButton
                        onClick={() => {
                            setIsExpandedView(prevState => !prevState)
                        }}>
                        <ExpandMoreIcon className={css.assistantItemExpandIcon} />
                    </IconButton>
                </div>
            </div>
            {isExpandedView && <div className={css.assistantItemDescription}>
                <p>
                    {props.assistant.description}
                </p>
            </div>}
        </div>
    )
}

export default AssistantItem