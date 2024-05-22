import React, { useState, useEffect } from 'react';
import { Badge, Container, Row, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import Header from 'components/Headers/Header.js';

const Tables = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [filters, setFilters] = useState({});
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simula la carga de datos
        setTimeout(() => {
            // Aquí puedes cargar tus datos reales
            setCustomers([
                {
                    id: 1,
                    project: "Argon Design System",
                    budget: 2500,
                    status: "pending",
                    users: "Carola",
                    completion: 60,
                    avatar: require('../../assets/img/theme/bootstrap.jpg')
                },
                {
                    id: 2,
                    project: "Angular Now UI Kit PRO",
                    budget: 1800,
                    status: "completed",
                    users: "Carola",
                    completion: 100,
                    avatar: require('../../assets/img/theme/angular.jpg')
                },
                {
                    id: 3,
                    project: "Black Dashboard",
                    budget: 3150,
                    status: "delayed",
                    users: "Carola",
                    completion: 72,
                    avatar: require('../../assets/img/theme/sketch.jpg')
                },
                {
                    id: 4,
                    project: "React Material Dashboard",
                    budget: 4400,
                    status: "on schedule",
                    users: "Carola",
                    completion: 90,
                    avatar: require('../../assets/img/theme/react.jpg')
                },
                {
                    id: 5,
                    project: "Vue Paper UI Kit PRO",
                    budget: 2200,
                    status: "completed",
                    users: "Carola",
                    completion: 100,
                    avatar: require('../../assets/img/theme/vue.jpg')
                }
            ]);
            setLoading(false);
        }, 2000);
    }, []);

    const header = (
        <div className="table-header">
            <h3 className="mb-0">Card tables</h3>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const projectBodyTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-center">
                <a
                    className="avatar rounded-circle mr-3"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                >
                    <img
                        alt="..."
                        src={rowData.avatar}
                    />
                </a>
                <span className="mb-0 text-sm">{rowData.project}</span>
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {
        const statusClass = {
            pending: 'bg-warning',
            completed: 'bg-success',
            delayed: 'bg-danger',
            'on schedule': 'bg-info'
        }[rowData.status];

        return (
            <Badge color="" className="badge-dot mr-4">
                <i className={statusClass} />
                {rowData.status}
            </Badge>
        );
    };

    const completionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-center">
                <span className="mr-2">{rowData.completion}%</span>
                <ProgressBar value={rowData.completion} />
            </div>
        );
    };

    const actionBodyTemplate = () => {
        return (
            <UncontrolledDropdown>
                <DropdownToggle
                    className="btn-icon-only text-light"
                    href="#pablo"
                    role="button"
                    size="sm"
                    color=""
                    onClick={(e) => e.preventDefault()}
                >
                    <i className="fas fa-ellipsis-v" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                    <DropdownItem
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                    >
                        Action
                    </DropdownItem>
                    <DropdownItem
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                    >
                        Another action
                    </DropdownItem>
                    <DropdownItem
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                    >
                        Something else here
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    };

    const onCustomerSelect = (event) => {
        setSelectedCustomer(event.data);
    };

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <div className="shadow">
                            
                            <DataTable value={customers} paginator showGridlines rows={10} loading={loading} dataKey="id"
                                selectionMode="single" selection={selectedCustomer} onSelectionChange={onCustomerSelect}
                                filters={filters} globalFilterFields={['project', 'budget', 'status', 'users', 'completion']} header={header}
                                emptyMessage="No projects found.">
                                <Column field="project" header="Project" body={projectBodyTemplate} filter filterPlaceholder="Search by project" style={{ minWidth: '12rem' }} />
                                <Column field="budget" header="Budget" filterField="budget" dataType="numeric" style={{ minWidth: '10rem' }} filter filterElement={(options) => (
                                    <InputNumber value={options.value} onValueChange={(e) => options.filterApplyCallback(e.value)} mode="currency" currency="USD" locale="en-US" />
                                )} />
                                <Column field="status" header="Status" body={statusBodyTemplate} filter filterElement={(options) => (
                                    <Dropdown value={options.value} options={['pending', 'completed', 'delayed', 'on schedule']} onChange={(e) => options.filterApplyCallback(e.value)} placeholder="Select a Status" />
                                )} style={{ minWidth: '10rem' }} />
                                <Column field="users" header="Users" filter filterPlaceholder="Search by users" style={{ minWidth: '10rem' }} />
                                <Column field="completion" header="Completion" body={completionBodyTemplate} filter filterElement={(options) => (
                                    <InputNumber value={options.value} onValueChange={(e) => options.filterApplyCallback(e.value)} min={0} max={100} />
                                )} style={{ minWidth: '10rem' }} />
                                <Column body={actionBodyTemplate} style={{ minWidth: '5rem' }} />
                            </DataTable>
                        </div>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default Tables;
