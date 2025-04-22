import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import {OrderRow} from "./OrderRow";

const Orders = ({orders, handleSorting, groups, setGroups, onUpdateOrder}) => {

    return (
        <TableContainer component={Paper}>
            <Table sx={{"& .MuiTableCell-head": {fontWeight: "bold"}, "& .MuiTableCell-root": {padding: "3px"}}}>
                <TableHead sx={{backgroundColor: "#87cefa"}}>
                    <TableRow>
                        <TableCell onClick={() => handleSorting("id")}>ID</TableCell>
                        <TableCell onClick={() => handleSorting("name")}>Name</TableCell>
                        <TableCell onClick={() => handleSorting("surname")}>
                            Surname
                        </TableCell>
                        <TableCell onClick={() => handleSorting("email")}>Email</TableCell>
                        <TableCell onClick={() => handleSorting("phone")}>Phone</TableCell>
                        <TableCell onClick={() => handleSorting("age")}>Age</TableCell>
                        <TableCell onClick={() => handleSorting("course")}>Course</TableCell>
                        <TableCell onClick={() => handleSorting("course_format")}>
                            Course format
                        </TableCell>
                        <TableCell onClick={() => handleSorting("course_type")}>
                            Course type
                        </TableCell>
                        <TableCell onClick={() => handleSorting("status")}>Status</TableCell>
                        <TableCell onClick={() => handleSorting("sum")}>Sum</TableCell>
                        <TableCell onClick={() => handleSorting("alreadyPaid")}>
                            Already paid
                        </TableCell>
                        <TableCell onClick={() => handleSorting("group")}>Group</TableCell>
                        <TableCell onClick={() => handleSorting("created_at")}>
                            Created at
                        </TableCell>
                        <TableCell onClick={() => handleSorting("manager")}>
                            Manager
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <OrderRow key={order.id} order={order} onUpdateOrder={onUpdateOrder} groups={groups}
                                  setGroups={setGroups}/>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export {Orders};
