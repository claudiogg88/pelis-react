import * as React from 'react';
import {useState} from 'react';
import {DataGrid, esES} from '@mui/x-data-grid';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Box, Slider, Typography} from "@mui/material";
import Form from 'react-bootstrap/Form';
import {Col, Row} from "react-bootstrap";
import {PedirPeliculas} from './Server';

const theme = createTheme(
    {
        palette: {
            primary: {main: '#1976d2'},
        },
    },
    esES,
);

const columns = [
    {
        field: 'IdPelicula',
        headerName: 'ID',
        flex: 1,
    },
    {
        field: 'TituloOriginalIMDB',
        headerName: 'Titulo',
        flex: 1,
    },
    {
        field: 'Calificacion',
        headerName: 'Calificacion',
        type: 'decimal',
        flex: 1,
    },
    {
        field: 'Anio',
        headerName: 'Año',
        type: 'integer',
        flex: 1,
    },
    {
        field: 'Votos',
        headerName: 'Votos',
        type: 'integer',
        flex: 1,
    },
    {
        field: 'Duracion',
        headerName: 'Duracion',
        type: 'integer',
        flex: 1,
    },
];


export default function DataTable()
{

    let PeliSearch = {};

    function BuscarPeliculas()
    {
        let filtros = {
            sortModel: pageState.sortModel,
            filterModel: pageState.filterModel,
            page: pageState.page,
            limit: pageState.pageSize,
        };
        PedirPeliculas(filtros)
    }

    //llamar a la funcion setPageState desencadenara un nuevo renderizado
    const [pageState, setPageState] = useState({
        isLoading: true,
        data: [],
        total: 0,
        page: 0,
        pageSize: 10,
        sortModel: [],
        filterModel: PeliSearch
    })

    function cambioFiltro(event)
    {
        const input = event.currentTarget;
        let ext = {}
        ext[input.name] = input.value;

        PeliSearch = {...PeliSearch, ...ext};
        console.log(PeliSearch);
        setPageState(old => ({...old, filterModel: PeliSearch}));
    }

    // useEffect(() =>
    // {
    //     async function fetchData()
    //     {
    //
    //         let filtros = {
    //             sortModel: pageState.sortModel,
    //             filterModel: pageState.filterModel,
    //             page: pageState.page,
    //             limit: pageState.pageSize,
    //         };
    //
    //
    //         console.log('filtrando peliculas')
    //         setPageState(old => ({...old, isLoading: true}))
    //
    //         const json = await FiltrarPeliculas(filtros);
    //         setPageState(old => ({...old, isLoading: false, data: json.Peliculas, total: json.Total}))
    //
    //     }
    //
    //     fetchData();
    // }, [pageState.page, pageState.pageSize, pageState.sortModel, pageState.filterModel])


    const [calificacionDef, setCalificacionDef] = useState([7.0, 10.0]);

    const cambioCalficacion = (event, newValue) =>
    {
        let ext = {}
        ext["Calificacion"] = newValue;

        PeliSearch = {...PeliSearch, ...ext};
        console.log(PeliSearch);
        setPageState(old => ({...old, filterModel: PeliSearch}));

        setCalificacionDef(newValue);
    };

    return (

        <Box
            sx={{
                height: 400,
                width: '100%',
            }}>
            <Form id="filtro">
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Titulo</Form.Label>
                            <Form.Control type="text" placeholder="titulo pelicula" name="Titulo"
                                          onChange={cambioFiltro}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Sinopsis</Form.Label>
                            <Form.Control type="text" placeholder="" name="Sinopsis" onChange={cambioFiltro}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Calificacion</Form.Label>
                            <Slider
                                name="Calificacion"
                                onChange={cambioFiltro}
                                step={0.1}
                                valueLabelDisplay="auto"
                                marks
                                min={0.0}
                                value={calificacionDef}
                                max={10.0}

                            />
                        </Form.Group>
                    </Col>
                </Row>

                <button type="button" onClick={BuscarPeliculas} className="btn btn-success">Buscar</button>
            </Form>
            <Typography
                variant="h4"
                component="h4"
                sx={{textAlign: 'center', mt: 3, mb: 3}}
            >
                Peliculas
            </Typography>

            <ThemeProvider theme={theme}>

                <div>
                    <DataGrid
                        autoHeight
                        rows={pageState.data}
                        rowCount={pageState.total}
                        loading={pageState.isLoading}
                        rowsPerPageOptions={[10, 30, 50, 100]}
                        pagination
                        page={pageState.page}
                        pageSize={pageState.pageSize}
                        paginationMode="server"
                        sortingMode="server"
                        onPageChange={(newPage) =>
                        {
                            setPageState(old => ({...old, page: newPage}))
                        }}
                        onPageSizeChange={(newPageSize) =>
                        {
                            setPageState(old => ({...old, pageSize: newPageSize}))
                        }}
                        onSortModelChange={(newSortModel) =>
                        {
                            setPageState(old => ({...old, sortModel: newSortModel}))
                        }}
                        columns={columns}
                        getRowId={(row) => row.IdIMDB}
                        initialState={{
                            sorting: {
                                sortModel: pageState.sortModel
                            },
                        }}
                    />
                </div>
            </ThemeProvider>
        </Box>
    );
}