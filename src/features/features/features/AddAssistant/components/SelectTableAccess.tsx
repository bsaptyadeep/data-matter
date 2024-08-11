import { Box, Checkbox, IconButton, Typography } from '@mui/material'
import css from './SelectTableAccess.module.css'
import { ITable } from '../index'

interface IProps {
    tables: ITable[],
    setTables: React.Dispatch<React.SetStateAction<ITable[]>>
}

const SelectTableAccess = (props: IProps) => {
    return (
        <Box className={css.selectTableContainerParent}>
            <Typography variant='h4' style={{
                color: "white",
                fontSize: "20px",
                marginTop: "10px"
            }}>
                Select tables:
            </Typography>
            <Box className={css.selectTableContainer}>
                {
                    props.tables.map((table, index) => {
                        return (
                            <Box key={`table-name-${table.name}`} className={css.selectTableContainerRow}>
                                <IconButton>
                                    <Checkbox
                                        value={table.selected}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                                            props.setTables((prevState) => {
                                                prevState[index].selected = checked;
                                                return [
                                                    ...prevState
                                                ]
                                            })
                                        }}
                                        style={{ color: "#957fff" }} />
                                </IconButton>
                                <Typography>
                                    {table.name}
                                </Typography>
                            </Box>
                        )
                    })
                }
            </Box>
        </Box>
    )
}

export default SelectTableAccess
