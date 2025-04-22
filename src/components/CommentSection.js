import React, {useState} from "react";
import {Box, Button, TextField} from "@mui/material";

const CommentSection = ({order, onAddComment}) => {
    const [comment, setComment] = useState("");

    const handleSubmitComment = () => {
        if (!comment.trim()) return;
        onAddComment(order.id, comment);
        setComment("");
    };

    return (
        <Box sx={{marginTop: 2}}>
            <TextField
                label="Add Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                fullWidth
            />
            <Button
                sx={{marginTop: 1}}
                variant="contained"
                onClick={handleSubmitComment}
            >
                Submit
            </Button>
        </Box>
    );
};

export {CommentSection};