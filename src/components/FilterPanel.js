import {
    Box, Button, Checkbox, FormControlLabel, MenuItem, Select, TextField
} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {enGB} from "date-fns/locale";
import {useEffect, useRef, useState} from "react";
import {debounce, isEqual} from "lodash";
import RefreshIcon from "@mui/icons-material/Refresh";
import {FaFileExcel} from "react-icons/fa";

import {exportOrdersToExcel} from "../services/exportService";

const FilterPanel = ({onFilterChange, groups}) => {
    const [filters, setFilters] = useState({
        name: "", surname: "", email: "", phone: "", age: "",
        course: "", course_format: "", course_type: "", status: "",
        group: "", start_date: "", end_date: "", only_my_applications: false,
    });

    const firstRender = useRef(true);
    const prevFilters = useRef(filters);

    const debouncedFilterChangeRef = useRef();

    useEffect(() => {
        debouncedFilterChangeRef.current = debounce((newFilters) => {
            if (isEqual(newFilters, prevFilters.current)) return;
            prevFilters.current = newFilters;
            onFilterChange(newFilters);
        }, 500);
    }, [onFilterChange]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        debouncedFilterChangeRef.current(filters)
    }, [filters]);

    const handleChange = (event) => {
        const {name, value, type, checked} = event.target;
        setFilters((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleDateChange = (name) => (newValue) => {
        if (!newValue || isNaN(new Date(newValue).getTime())) return;
        setFilters((prev) => ({
            ...prev,
            [name]: newValue.toISOString().split("T")[0],
        }));
    };

    const resetFilters = () => {
        setFilters({
            name: "", surname: "", email: "", phone: "", age: "",
            course: "", course_format: "", course_type: "", status: "",
            group: "", start_date: "", end_date: "", only_my_applications: false,
        });
    };

    const handleExportExcel = async () => {
        try {
            const ordering = new URLSearchParams(window.location.search).get("ordering");
            const blob = await exportOrdersToExcel(filters, ordering);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "orders.xlsx";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Export failed");
            console.error(error);
        }
    };

    return (
        <Box sx={{padding: 2, backgroundColor: "#f5f5f5", borderRadius: 2, display: "flex", gap: 2}}>
            <Box sx={{display: "flex", flexDirection: "column", gap: 2, flexGrow: 1}}>
                <Box sx={{display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2}}>
                    <TextField name="name" label="Name" value={filters.name} onChange={handleChange}/>
                    <TextField name="surname" label="Surname" value={filters.surname} onChange={handleChange}/>
                    <TextField name="email" label="Email" value={filters.email} onChange={handleChange}/>
                    <TextField name="phone" label="Phone" value={filters.phone} onChange={handleChange}/>
                    <TextField name="age" label="Age" type="number" value={filters.age} onChange={handleChange}/>
                    <Select name="course" value={filters.course} onChange={handleChange} displayEmpty>
                        <MenuItem value="">All Courses</MenuItem>
                        <MenuItem value="FS">FS</MenuItem>
                        <MenuItem value="QACX">QACX</MenuItem>
                        <MenuItem value="JCX">JCX</MenuItem>
                        <MenuItem value="JSCX">JSCX</MenuItem>
                        <MenuItem value="FE">FE</MenuItem>
                        <MenuItem value="PCX">PCX</MenuItem>
                    </Select>
                </Box>

                <Box sx={{display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 2}}>
                    <Select name="course_format" value={filters.course_format} onChange={handleChange} displayEmpty>
                        <MenuItem value="">All Formats</MenuItem>
                        <MenuItem value="online">Online</MenuItem>
                        <MenuItem value="static">Static</MenuItem>
                    </Select>
                    <Select name="course_type" value={filters.course_type} onChange={handleChange} displayEmpty>
                        <MenuItem value="">All Types</MenuItem>
                        <MenuItem value="pro">Pro</MenuItem>
                        <MenuItem value="minimal">Minimal</MenuItem>
                        <MenuItem value="premium">Premium</MenuItem>
                        <MenuItem value="incubator">Incubator</MenuItem>
                        <MenuItem value="vip">VIP</MenuItem>
                    </Select>
                    <Select name="status" value={filters.status} onChange={handleChange} displayEmpty>
                        <MenuItem value="">All Status</MenuItem>
                        <MenuItem value="In work">In Work</MenuItem>
                        <MenuItem value="New">New</MenuItem>
                        <MenuItem value="Aggre">Aggre</MenuItem>
                        <MenuItem value="Disaggre">Disaggre</MenuItem>
                        <MenuItem value="Dubbing">Dubbing</MenuItem>
                    </Select>
                    <Select name="group" value={filters.group} onChange={handleChange} displayEmpty>
                        <MenuItem value="">All Groups</MenuItem>
                        {groups.map((group) => (
                            <MenuItem key={group.id} value={group.name}>
                                {group.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                        <DatePicker
                            label="Start Date"
                            value={filters.start_date ? new Date(filters.start_date) : null}
                            onChange={handleDateChange("start_date")}
                            format="MM.dd.yyyy"
                            slotProps={{textField: {variant: "outlined"}}}
                        />
                        <DatePicker
                            label="End Date"
                            value={filters.end_date ? new Date(filters.end_date) : null}
                            onChange={handleDateChange("end_date")}
                            format="MM.dd.yyyy"
                            slotProps={{textField: {variant: "outlined"}}}
                        />
                    </LocalizationProvider>
                </Box>
            </Box>

            <Box sx={{display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1}}>
                <FormControlLabel
                    control={<Checkbox name="only_my_applications" checked={filters.only_my_applications}
                                       onChange={handleChange}/>}
                    label="My"
                />
                <Button variant="contained" onClick={resetFilters}>
                    <RefreshIcon/>
                </Button>
                <Button variant="contained" color="success" onClick={handleExportExcel}>
                    <FaFileExcel/>
                </Button>
            </Box>
        </Box>
    );
};

export {FilterPanel};
