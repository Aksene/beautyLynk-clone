import React from 'react'

const Pagination = ({ rowsPerPage, length, handlePagination, currentPage, type }) => {
    let paginationNumber = []
    for (let i = 1; i <= Math.ceil(length / rowsPerPage); i++) {
        paginationNumber.push(i);
    }
    return (
        <div className='pagination'>
            {
                paginationNumber.map((data) => (
                    <button key={data} onClick={() => handlePagination(data,type)} className={currentPage === data ? 'active' : ''}>
                        {data}
                    </button>
                ))
            }
        </div>
    )
}
export default Pagination