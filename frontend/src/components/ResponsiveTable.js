import React, { useState } from 'react';

const ResponsiveTable = ({ 
  data = [], 
  columns = [], 
  title,
  searchable = true,
  itemsPerPage = 10 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;

  // Arama filtresi
  const filteredData = data.filter(item =>
    columns.some(column =>
      String(item[column.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sıralama
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aVal = a[sortColumn] || '';
    const bVal = b[sortColumn] || '';
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Sayfalama
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Sıralama fonksiyonu
  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Mobil kart görünümü
  const MobileCard = ({ item, index }) => (
    <div key={index} style={{
      background: 'var(--white)',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '10px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid var(--border-color)'
    }}>
      {columns.map((column, colIndex) => (
        <div key={colIndex} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 0',
          borderBottom: colIndex < columns.length - 1 ? '1px solid var(--border-color)' : 'none'
        }}>
          <span style={{
            fontWeight: '600',
            color: 'var(--text-dark)',
            fontSize: '13px',
            flex: '0 0 40%'
          }}>
            {column.label}:
          </span>
          <span style={{
            color: 'var(--text-light)',
            fontSize: '13px',
            textAlign: 'right',
            flex: '1'
          }}>
            {column.render ? column.render(item[column.key], item) : (item[column.key] || '-')}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{
      background: 'var(--white)',
      borderRadius: '15px',
      padding: isMobile ? '15px' : '20px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      margin: '20px 0'
    }}>
      {/* Başlık */}
      {title && (
        <h3 style={{
          color: 'var(--primary-dark)',
          fontSize: isMobile ? '18px' : '20px',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: '600'
        }}>
          {title}
        </h3>
      )}

      {/* Arama ve Filtreler */}
      {searchable && (
        <div style={{
          marginBottom: '20px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '10px',
          alignItems: isMobile ? 'stretch' : 'center',
          justifyContent: 'space-between'
        }}>
          <input
            type="text"
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: isMobile ? '12px 15px' : '10px 15px',
              border: '2px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: isMobile ? '16px' : '14px',
              flex: isMobile ? 'none' : '1',
              maxWidth: isMobile ? 'none' : '300px'
            }}
          />
          <div style={{
            color: 'var(--text-light)',
            fontSize: '14px',
            textAlign: isMobile ? 'center' : 'right'
          }}>
            {filteredData.length} kayıt bulundu
          </div>
        </div>
      )}

      {/* Tablo veya Kart Görünümü */}
      {isMobile ? (
        // Mobil Kart Görünümü
        <div>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <MobileCard key={index} item={item} index={index} />
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: 'var(--text-light)',
              fontSize: '16px'
            }}>
              Kayıt bulunamadı
            </div>
          )}
        </div>
      ) : (
        // Desktop Tablo Görünümü
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ minWidth: '600px' }}>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th 
                    key={index}
                    onClick={() => column.sortable && handleSort(column.key)}
                    style={{
                      cursor: column.sortable ? 'pointer' : 'default',
                      userSelect: 'none',
                      position: 'relative'
                    }}
                  >
                    {column.label}
                    {column.sortable && sortColumn === column.key && (
                      <span style={{ marginLeft: '5px' }}>
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={index}>
                    {columns.map((column, colIndex) => (
                      <td key={colIndex}>
                        {column.render ? column.render(item[column.key], item) : (item[column.key] || '-')}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px' }}>
                    Kayıt bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: isMobile ? '10px 15px' : '8px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: '5px',
              background: currentPage === 1 ? 'var(--border-color)' : 'var(--white)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: isMobile ? '14px' : '12px'
            }}
          >
            Önceki
          </button>

          <span style={{
            padding: '0 15px',
            fontSize: isMobile ? '14px' : '12px',
            color: 'var(--text-dark)'
          }}>
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: isMobile ? '10px 15px' : '8px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: '5px',
              background: currentPage === totalPages ? 'var(--border-color)' : 'var(--white)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: isMobile ? '14px' : '12px'
            }}
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
};

export default ResponsiveTable;