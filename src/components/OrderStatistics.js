import {Box, Typography} from "@mui/material";

const OrderStatistics = ({stats}) => {
    const defaultStats = {
        "Agree": 0,
        "In Work": 0,
        "Disagree": 0,
        "Dubbing": 0,
        "New": 0,
    };

    let total = 0;

    const mergedStats = stats.reduce((acc, stat) => {
        if (stat.status) {
            acc[stat.status] = stat.count;
        } else {
            total = stat.count;
        }
        return acc;
    }, {...defaultStats});

    return (
        <Box>
            <Typography variant="h6">Order Statistics</Typography>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
                paddingLeft: 5,
                width: "100%"
            }}>

                <Typography>Total: {total}</Typography>
                {Object.entries(mergedStats).map(([status, count]) => (
                    <Typography key={status}>{status}: {count}</Typography>
                ))}
            </Box>
        </Box>
    );
};

export {OrderStatistics};
