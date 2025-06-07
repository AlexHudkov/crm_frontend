import {useEffect, useState} from "react";
import {
    Modal, Box, Typography, TextField, Button, Select, MenuItem, FormControl
} from "@mui/material";
import {groupService} from "../services/groupService";

const EditModal = ({open, onClose, order, onSave, groups, setGroups}) => {
    const [formData, setFormData] = useState(null); // <-- Явно null, не undefined
    const [isAddingGroup, setIsAddingGroup] = useState(false);
    const [newGroup, setNewGroup] = useState("");
    const [isGroupAdded, setIsGroupAdded] = useState(false);

    useEffect(() => {
        if (!order) return;

        const shouldDefaultToInWork =
            (!order.manager_id) && (order.status === null || order.status === "New");

        setFormData({
            ...order,
            status: shouldDefaultToInWork ? "In Work" : order.status || "",
        });
    }, [order]);

    if (!formData) {
        return null;
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleAddGroup = async () => {
        if (!newGroup.trim()) return;
        if (groups.some((group) => group.name.toLowerCase() === newGroup.toLowerCase())) {
            alert("This group already exists!");
            return;
        }
        try {
            const response = await groupService.createGroup(newGroup);
            const newGroupData = response.data;

            setGroups((prevGroups) => [...prevGroups, newGroupData]);

            setIsGroupAdded(true);
        } catch (error) {
            console.error("Failed to add group:", error);
        }
    };

    const handleSelectGroup = () => {
        setFormData({...formData, group: newGroup});
        setIsAddingGroup(false);
        setIsGroupAdded(false);
        setNewGroup("");
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{width: 600, margin: "100px auto", padding: 3, backgroundColor: "#fff", borderRadius: "8px"}}>
                <Box display="flex" gap={2}>
                    <Box flex={1}>
                        <Typography>Group</Typography>
                        {isAddingGroup ? (
                            <Box display="flex" flexDirection="column" alignItems="stretch">
                                <TextField
                                    value={newGroup}
                                    onChange={(e) => setNewGroup(e.target.value)}
                                    fullWidth
                                    size="small"
                                    autoFocus
                                    sx={{
                                        marginTop: 1,
                                        height: "55px",
                                        '& .MuiInputBase-root': {height: "55px"}
                                    }}
                                />
                                <Box display="flex">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={handleAddGroup}
                                        sx={{
                                            marginTop: 0.5,
                                            backgroundColor: "#1976D2",
                                            color: "#fff",
                                            borderRadius: "5px",
                                            width: "50%",
                                            height: "20px"
                                        }}
                                    >
                                        Add
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={isGroupAdded ? handleSelectGroup : () => setIsAddingGroup(false)}
                                        sx={{
                                            marginTop: 0.5,
                                            backgroundColor: isGroupAdded ? "#4CAF50" : "#f37575",
                                            color: "#fff",
                                            borderRadius: "5px",
                                            width: "50%",
                                            height: "20px"
                                        }}
                                    >
                                        {isGroupAdded ? "Select" : "Cancel"}
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <>
                                <FormControl fullWidth margin="dense">
                                    <Select
                                        name="group"
                                        value={formData.group || ""}
                                        onChange={handleChange}
                                        displayEmpty
                                        sx={{height: "55px"}}
                                    >
                                        {groups.map((group) => (
                                            <MenuItem key={group.id} value={group.name}>
                                                {group.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => setIsAddingGroup(true)}
                                    sx={{marginTop: 0, height: "20px"}}
                                >
                                    Add Group
                                </Button>
                            </>
                        )}

                        <Typography sx={{marginTop: 0.5}}>Name</Typography>
                        <TextField name="name" value={formData.name || ""} onChange={handleChange} fullWidth
                                   margin="dense"/>
                        <Typography>Surname</Typography>
                        <TextField name="surname" value={formData.surname || ""} onChange={handleChange} fullWidth
                                   margin="dense"/>
                        <Typography>Email</Typography>
                        <TextField name="email" value={formData.email || ""} onChange={handleChange} fullWidth
                                   margin="dense"/>
                        <Typography>Phone</Typography>
                        <TextField name="phone" value={formData.phone || ""} onChange={handleChange} fullWidth
                                   margin="dense"/>
                        <Typography>Age</Typography>
                        <TextField name="age" type="number" value={formData.age || ""} onChange={handleChange} fullWidth
                                   margin="dense"/>
                    </Box>

                    <Box flex={1}>
                        <Typography>Status</Typography>
                        <FormControl fullWidth margin="dense">
                            <Select name="status" value={formData.status || ""} onChange={handleChange}>
                                <MenuItem value="In Work">In Work</MenuItem>
                                <MenuItem value="New">New</MenuItem>
                                <MenuItem value="Aggre">Aggre</MenuItem>
                                <MenuItem value="Disaggre">Disaggre</MenuItem>
                                <MenuItem value="Dubbing">Dubbing</MenuItem>
                            </Select>
                        </FormControl>

                        <Typography sx={{marginTop: 2.9}}>Sum</Typography>
                        <TextField name="sum" type="number" value={formData.sum || ""} onChange={handleChange} fullWidth
                                   margin="dense"/>
                        <Typography>Already Paid</Typography>
                        <TextField name="alreadyPaid" type="number" value={formData.alreadyPaid || ""}
                                   onChange={handleChange} fullWidth margin="dense"/>

                        <Typography>Course</Typography>
                        <FormControl fullWidth margin="dense">
                            <Select name="course" value={formData.course || ""} onChange={handleChange}>
                                <MenuItem value="FS">FS</MenuItem>
                                <MenuItem value="QACX">QACX</MenuItem>
                                <MenuItem value="JCX">JCX</MenuItem>
                                <MenuItem value="JSCX">JSCX</MenuItem>
                                <MenuItem value="FE">FE</MenuItem>
                                <MenuItem value="PCX">PCX</MenuItem>
                            </Select>
                        </FormControl>

                        <Typography>Course Format</Typography>
                        <FormControl fullWidth margin="dense">
                            <Select name="course_format" value={formData.course_format || ""} onChange={handleChange}>
                                <MenuItem value="online">Online</MenuItem>
                                <MenuItem value="static">Static</MenuItem>
                            </Select>
                        </FormControl>

                        <Typography>Course Type</Typography>
                        <FormControl fullWidth margin="dense">
                            <Select name="course_type" value={formData.course_type || ""} onChange={handleChange}>
                                <MenuItem value="pro">pro</MenuItem>
                                <MenuItem value="minimal">minimal</MenuItem>
                                <MenuItem value="premium">premium</MenuItem>
                                <MenuItem value="incubator">incubator</MenuItem>
                                <MenuItem value="vip">vip</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" marginTop={2}>
                    <Button variant="outlined" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="contained" onClick={() => onSave(formData)}>
                        Submit
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export {EditModal};
