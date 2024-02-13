import { Box, Button, Stack, SxProps } from '@mui/material';
import { PaginationOptions } from '@windingtree/sdk-types';
import { defaultPageSkip } from '../utils/defaults.js';
import { Page } from '../utils/types.js';

interface PaginationProps {
  page: Page;
  onChange: (pageOptions: Required<PaginationOptions>) => void;
  sx?: SxProps;
}

export const Pagination = ({ page, onChange, sx }: PaginationProps) => {
  page.total = page.total ?? 0;
  page.start = page.start ?? 0;
  page.skip = page.skip ?? defaultPageSkip;
  const totalPages = Math.ceil(page.total / page.skip);
  const currentPage = Math.ceil(page.start / page.skip) + 1;

  const handlePageChange = (pageNumber: number) => {
    const newStart = (pageNumber - 1) * page.skip;
    onChange({ start: newStart, skip: page.skip });
  };

  return (
    <Box sx={sx}>
      <Stack direction="row" spacing={1}>
        {[...Array(totalPages).keys()].map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber + 1 ? 'outlined' : 'text'}
            size="small"
            onClick={() => handlePageChange(pageNumber + 1)}
            disabled={currentPage === pageNumber + 1}
          >
            {pageNumber + 1}
          </Button>
        ))}
        <Button
          variant="text"
          size="small"
          onClick={() =>
            currentPage < totalPages && handlePageChange(currentPage + 1)
          }
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
};
