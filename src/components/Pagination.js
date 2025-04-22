import React from "react";
import {Pagination as MuiPagination, Stack} from "@mui/material";

const Pagination = ({currentPage, totalPages, setCurrentPage}) => {
    const handleChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Stack spacing={2} sx={{marginTop: 2}} alignItems="center">
            <MuiPagination
                count={totalPages}
                page={currentPage}
                onChange={handleChange}
                variant="outlined"
                shape="rounded"

                boundaryCount={1}
                siblingCount={2}
                hidePrevButton={currentPage === 1}
                hideNextButton={currentPage === totalPages}

            />
        </Stack>
    );
};

export {Pagination};