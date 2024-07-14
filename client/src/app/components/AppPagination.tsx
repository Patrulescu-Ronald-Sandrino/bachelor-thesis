import { PageData } from '../models/pagination.ts';
import { useState } from 'react';
import { Box, Pagination, Typography } from '@mui/material';

interface Props {
  pageData: PageData;
  onPageChange: (page: number) => void;
}

export default function AppPagination({ pageData, onPageChange }: Props) {
  const { currentPage, totalCount, totalPages, pageSize } = pageData;
  const [pageNumber, setPageNumber] = useState(currentPage);

  function handlePageChange(page: number) {
    setPageNumber(page);
    onPageChange(page);
  }

  if (totalCount === 0)
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h6">No items found</Typography>
      </Box>
    );

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography>
        Displaying {(currentPage - 1) * pageSize + 1}-
        {Math.min(currentPage * pageSize, totalCount)} of {totalCount} items
      </Typography>
      <Pagination
        color="secondary"
        size="large"
        count={totalPages}
        page={pageNumber}
        onChange={(_, page) => handlePageChange(page)}
      />
    </Box>
  );
}
