import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button
} from "@mui/material";

const CreateManagerModal = ({open, onClose, formData, onChange, onSubmit}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create Manager</DialogTitle>
            <DialogContent sx={{display: "flex", flexDirection: "column", gap: 2, paddingTop: 1}}>
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    fullWidth
                />
                <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    fullWidth
                />
                <TextField
                    label="Surname"
                    name="surname"
                    value={formData.surname}
                    onChange={onChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions sx={{justifyContent: "center", paddingBottom: 2}}>
                <Button onClick={onClose} color="success" variant="contained">CANCEL</Button>
                <Button onClick={onSubmit} color="success" variant="contained">CREATE</Button>
            </DialogActions>
        </Dialog>
    );
};

export {CreateManagerModal};