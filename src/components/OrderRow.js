import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {
    Box,
    Typography,
    TableRow,
    TableCell,
    Collapse,
    TextField,
    Button,
} from "@mui/material";
import {EditModal} from "./EditModal";
import {commentService} from "../services/commentService";
import {orderService} from "../services/orderService";

const OrderRow = ({order, onUpdateOrder, groups, setGroups}) => {
    const {currentUser} = useContext(AuthContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState(order.comments || []);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const canEdit =
        currentUser?.role === "admin" ||
        !order.manager_id ||
        order.manager_id === currentUser?.id;


    useEffect(() => {
        setComments(order.comments || []);
    }, [order]);

    const handleExpand = () => {
        if (!canEdit) return;
        setIsExpanded(!isExpanded);
        setSelectedId(order.id === selectedId ? null : order.id);
    };

    const handleSubmitComment = async () => {
        if (!comment.trim()) return;

        try {
            const updatedOrder = await commentService.add(order.id, comment);

            setComments(updatedOrder.comments || []);
            onUpdateOrder(updatedOrder);
            setComment("");
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        await commentService.remove(order.id, commentId);
        setComments((prevComments) => prevComments.filter((c) => c.id !== commentId));
    };

    const handleEditClick = () => {
        if (canEdit) {
            setIsEditModalOpen(true);
        } else {
            alert("You cannot edit this order because it is managed by another user.");
        }
    };

    const handleSaveChanges = async (updatedOrderData) => {
        const updatedOrder = await orderService.update(order.id, updatedOrderData);
        onUpdateOrder(updatedOrder);
        setIsEditModalOpen(false);
    };

    return (
        <>
            <TableRow
                onClick={handleExpand}
                sx={{
                    cursor: "pointer",
                    backgroundColor: selectedId === order.id ? "lightblue" : "inherit",
                    "&:hover": {backgroundColor: "#dceefd"},
                }}
            >
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.name}</TableCell>
                <TableCell>{order.surname}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>{order.age}</TableCell>
                <TableCell>{order.course}</TableCell>
                <TableCell>{order.course_format}</TableCell>
                <TableCell>{order.course_type}</TableCell>
                <TableCell>{order.status || "null"}</TableCell>
                <TableCell>{order.sum}</TableCell>
                <TableCell>{order.alreadyPaid}</TableCell>
                <TableCell>{order.group}</TableCell>
                <TableCell sx={{fontFamily: "monospace"}}>
                    {(() => {
                        const date = new Date(order.created_at);
                        const day = date.getDate().toString().padStart(2, "0");
                        const month = date.toLocaleString("en-US", {month: "short"});
                        const year = date.getFullYear();
                        return `${month} ${day}, ${year}`;
                    })()}
                </TableCell>
                <TableCell>{order.manager_name || "Not assigned"}</TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={16}>
                    <Collapse in={isExpanded}>
                        <Box sx={{padding: 2, border: "1px solid #ccc"}}>
                            <Box sx={{display: "flex"}}>
                                <Box sx={{flex: 1, paddingRight: 2}}>
                                    <Typography variant="body1">
                                        <strong>Msg:</strong> {order.msg || "N/A"}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>UTM:</strong> {order.utm || "N/A"}
                                    </Typography>
                                </Box>
                                <Box sx={{flex: 1, paddingLeft: 2}}>
                                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                        <Typography variant="h6">Comments</Typography>
                                        <Button variant="outlined" onClick={handleEditClick}>
                                            Edit
                                        </Button>
                                    </Box>
                                    <Box>
                                        {comments.map((c) => (
                                            <Box
                                                key={c.id}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    marginBottom: 1,
                                                }}
                                            >
                                                <Typography variant="body2" sx={{flexGrow: 1}}>
                                                    {c.text}
                                                </Typography>
                                                <Box sx={{display: "flex", alignItems: "center"}}>
                                                    <Typography variant="body2" sx={{marginLeft: 2}}>
                                                        <strong>{c.author_name}</strong>: {new Date(c.created_at).toLocaleString()}
                                                    </Typography>
                                                    {(currentUser?.id === c.author_id || currentUser?.role === "admin") && (
                                                        <Button
                                                            variant="text"
                                                            color="error"
                                                            onClick={() => handleDeleteComment(c.id)}
                                                        >
                                                            X
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                    <Box sx={{display: "flex", alignItems: "center", marginTop: 2}}>
                                        <TextField
                                            label="Add Comment"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            fullWidth
                                            sx={{marginRight: 2}}
                                        />
                                        <Button variant="contained" onClick={handleSubmitComment}>
                                            Submit
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

            {isEditModalOpen && (
                <EditModal
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    order={order}
                    onSave={handleSaveChanges}
                    groups={groups}
                    setGroups={setGroups}
                />
            )}
        </>
    );
};

export {OrderRow};
