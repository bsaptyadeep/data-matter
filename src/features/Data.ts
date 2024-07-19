export interface IAssistant {
    _id: string,
    name: string,
    default_model: string,
    description: string,
    connection_string: string,
    database_type: string,
    tables: string[]
}