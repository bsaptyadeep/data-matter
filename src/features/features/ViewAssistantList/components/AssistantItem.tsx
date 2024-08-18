import { CircularProgress, IconButton } from '@mui/material'
import { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import css from './AssistantItem.module.css';
import { IAssistant } from '../../../Data';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { apiClient } from '../../../../utils/apiHandler';

interface IProps {
    key: string,
    assistant: IAssistant,
    fetchAssistantList: () => Promise<void>
}

const AssistantItem = (props: IProps) => {
    const navigate = useNavigate()
    const [isExpandedView, setIsExpandedView] = useState<boolean>(false)
    const [isDeletingAssistant, setIsDeletingAssistant] = useState<boolean>(false)

    const handleDeleteAssistant = async () => {
        try {
            setIsDeletingAssistant(true)
            await apiClient("DELETE", `/assistant/${props.assistant._id}`, {})
            await props.fetchAssistantList()
            setIsDeletingAssistant(false)
        } catch (error) {
            alert(`Failed to delete the Assistant ${props.assistant.name}: ${error}`)
        }
    }

    return (
        <div key={props.key} className={css.assistantListItemContainer}>
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
                    <IconButton onClick={handleDeleteAssistant}>
                        {
                            isDeletingAssistant ?
                                <CircularProgress style={{ width: 16, height: 16 }} />
                                :
                                <DeleteIcon className={css.assistantItemDeleteIcon} />
                        }
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