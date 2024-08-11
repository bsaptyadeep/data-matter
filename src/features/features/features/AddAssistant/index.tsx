import { Box, CircularProgress, IconButton, Typography } from '@mui/material'
import css from './styles.module.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useEffect, useState } from 'react';
import SelectTableAccess from './components/SelectTableAccess';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SERVER_BASE_URL } from '../../../../constants';
import { apiClient } from '../../../../utils/apiHandler';

type databaseType = "postgresql"
type modelType = "gpt-3.5"

interface IAddAssistantForm {
  name: string,
  model: modelType,
  databaseType: databaseType,
  connectionString: string,
  description: string,
}

export interface ITable {
  name: string,
  selected: boolean
}

const AddAssistant = () => {
  const [addAssistantFormData, setAddAssistantFormData] = useState<IAddAssistantForm>({
    name: "",
    model: "gpt-3.5",
    databaseType: "postgresql",
    connectionString: "",
    description: ""
  })
  const navigate = useNavigate()
  const [tables, setTables] = useState<ITable[]>([])
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState<string>("")
  const newSearchParams = new URLSearchParams(searchParams);
  const [assistantId, setAssistantId] = useState<string>(newSearchParams.get("assistant-id") || "")
  const [isAddingAssistant, setIsAddingAssistant] = useState<boolean>(false)
  const [isSelectingTables, setIsSelectingTables] = useState<boolean>(false)

  const updateQueryParam = (param: string, value: string) => {
    newSearchParams.set(param, value);
    setSearchParams(newSearchParams);
  };

  const handleChangeConnectionString = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddAssistantFormData(prevState => {
      return {
        ...prevState,
        connectionString: event.target.value as string
      }
    })
  }

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddAssistantFormData(prevState => {
      return {
        ...prevState,
        name: event.target.value as string
      }
    })
  }

  const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddAssistantFormData(prevState => {
      return {
        ...prevState,
        description: event.target.value as string
      }
    })
  }

  const handleNext = async () => {
    setIsAddingAssistant(true)
    try {
      const reqBody = {
        name: addAssistantFormData.name,
        default_model: addAssistantFormData.model,
        description: addAssistantFormData.description,
        connection_string: addAssistantFormData.connectionString,
        database_type: addAssistantFormData.databaseType
      }
      const apiResponse = await apiClient("POST", "/assistant", reqBody)
      if (apiResponse?.id) {
        updateQueryParam("assistant-id", apiResponse.id)
        setAssistantId(apiResponse.id)
      }
    } catch (error) {
      setError("Invalid Connection String, Try Again")
      setTimeout(() => {
        setError("")
      }, 5000)
    } finally {
      setIsAddingAssistant(false)
    }
  }

  const handleSelectTable = async () => {
    try {
      setIsSelectingTables(true)
      const reqBody = {
        id: assistantId,
        tables: tables.filter(table => table.selected).map(table => table.name)
      }
      await apiClient("PUT", "/assistant", reqBody)
      navigate(`/chat?assistant_id=${assistantId}`)
    } catch (error) {
      setError("Error Occured! Please try again after sometime")
      setTimeout(() => {
        setError("")
      }, 5000)
    } finally {
      setIsSelectingTables(false)
    }
  }

  useEffect(() => {
    const access_token = localStorage.getItem("access_token")
    if (!access_token) {
      navigate("/auth")
    }
  }, [navigate])

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const apiResponse = await apiClient(
          "GET",
          `/assistant/table?id=${assistantId}`,
          {}
        )
        if (apiResponse.tables) {
          const tablesArray: ITable[] = []
          const tableNames: string[] = apiResponse.tables
          tableNames.forEach((tableName: string) => {
            tablesArray.push({
              name: tableName,
              selected: false
            })
          })
          setTables(tablesArray)
        }
      } catch (error) {
        setError("Invalid Connection String")
        console.error(error)
        setTimeout(() => {
          setError("")
        }, 5000)
      }
    }

    if (assistantId) {
      fetchTables()
    }
  }, [assistantId])

  return (
    <Box style={{ height: window.innerHeight }}>
      <Box className={css.addAssistantContainer}>
        <Box className={css.addAssistantHeading}>
          <Box className={css.addAssistantHeadingLeft}>
            <Link to={"http://localhost:3000/"}>
              <IconButton>
                <ArrowBackIosNewIcon className={css.addAssistantHeadingIcon} />
              </IconButton>
            </Link>
            <Typography style={{ fontWeight: 600 }}>Create you DB Assistant</Typography>
          </Box>
          {error && <Box>
            <Typography className={css.error}>
              {error}
            </Typography>
          </Box>}
          <Box>
            {tables.length === 0 ? <button
              className={css.nextButton}
              onClick={handleNext}>
              {
                isAddingAssistant ?
                  <CircularProgress style={{ width: 15, height: 15, marginLeft: 10, color: "white" }} />
                  : "Create"
              }
            </button>
              : <button
                className={css.nextButton}
                onClick={handleSelectTable}
              >
                {
                  isSelectingTables ?
                    <CircularProgress style={{ width: 15, height: 15, marginLeft: 10, color: "white" }} />
                    : "Finish"
                }
              </button>}
          </Box>
        </Box>
        {tables.length === 0 ?
          <Box className={css.addAssistantFormContainer}>
            <Box className={css.addAssistantInputWrapper}>
              <label>Assistant Name</label>
              <input
                value={addAssistantFormData.name}
                type="text"
                onChange={handleChangeName}
                placeholder="Enter Assistant Name"
              />
            </Box>
            <Box className={css.addAssistantInputWrapper}>
              <label>Default Model</label>
              <select value={addAssistantFormData.model}>
                <option>
                  GPT-3.5
                </option>
              </select>
            </Box>
            <Box className={css.addAssistantInputWrapper}>
              <label>Database Type</label>
              <select value={addAssistantFormData.databaseType}>
                <option>
                  PostgreSQL
                </option>
              </select>
            </Box>
            <Box className={css.addAssistantInputWrapper}>
              <label>Connection String</label>
              <input
                value={addAssistantFormData.connectionString}
                type="text"
                onChange={handleChangeConnectionString}
                placeholder="Enter Connection String"
              />
            </Box>
            <Box className={css.addAssistantInputWrapper}>
              <label>Description </label>
              <input
                value={addAssistantFormData.description}
                type="text"
                onChange={handleChangeDescription}
                placeholder="Enter Description"
              />
            </Box>
          </Box>
          : <SelectTableAccess tables={tables} setTables={setTables} />}
      </Box>
    </Box>
  )
}

export default AddAssistant
