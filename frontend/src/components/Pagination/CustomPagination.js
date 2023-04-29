import Pagination from "react-bootstrap/Pagination";
import { useEffect } from "react";
import usePagination from "../../hooks/usePagination";
import { DOTS } from "../../constants/common_constants";

import "./pagination.css";

const CustomPagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
  setCurrentPage,
  searchData,
  setSearchData,
}) => {
  const paginationRange = usePagination({
    totalCount,
    pageSize,
    siblingCount,
    currentPage,
  });

  useEffect(() => {
    // setSearchData({ ...searchData, page: currentPage });
  }, [currentPage]);

  const totalPageCount = Math.ceil(totalCount / pageSize);

  const onPrev = () => {
    setCurrentPage((current) => Math.max(current - 1, 1));
    setSearchData({
      ...searchData,
      page: Math.max(currentPage - 1, 1),
    });
  };

  const onNext = () => {
    setCurrentPage((current) => Math.min(current + 1, totalPageCount));
    setSearchData({
      ...searchData,
      page: Math.min(currentPage + 1, totalPageCount),
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Pagination>
        {currentPage === 1 ? (
          <Pagination.Prev disabled />
        ) : (
          <Pagination.Prev onClick={onPrev} />
        )}
        {paginationRange.map((paginationNumber, index) => {
          return (
            <PaginationElement
              key={index}
              paginationNumber={paginationNumber}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              searchData={searchData}
              setSearchData={setSearchData}
            />
          );
        })}
        {currentPage === totalPageCount ? (
          <Pagination.Next disabled />
        ) : (
          <Pagination.Next onClick={onNext} />
        )}
      </Pagination>
    </div>
  );
};

const PaginationElement = ({
  paginationNumber,
  currentPage,
  setCurrentPage,
  searchData,
  setSearchData,
}) => {
  const onChange = () => {
    setCurrentPage(paginationNumber);
    setSearchData({
      ...searchData,
      page: paginationNumber,
    });
  };

  if (paginationNumber === DOTS) {
    return <Pagination.Ellipsis />;
  } else if (currentPage === paginationNumber) {
    return <Pagination.Item active>{paginationNumber}</Pagination.Item>;
  } else {
    return (
      <Pagination.Item onClick={onChange}>{paginationNumber}</Pagination.Item>
    );
  }
};

export default CustomPagination;
