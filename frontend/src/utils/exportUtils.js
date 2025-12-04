import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Filename without extension
 * @param {string} sheetName - Name of the sheet
 */
export const exportToExcel = (data, filename = 'export', sheetName = 'Data') => {
    try {
        // Create worksheet from data
        const worksheet = XLSX.utils.json_to_sheet(data);
        
        // Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        
        // Auto-size columns
        const maxWidth = 50;
        const colWidths = {};
        
        data.forEach(row => {
            Object.keys(row).forEach(key => {
                const value = String(row[key] || '');
                const currentWidth = colWidths[key] || key.length;
                colWidths[key] = Math.min(maxWidth, Math.max(currentWidth, value.length));
            });
        });
        
        worksheet['!cols'] = Object.values(colWidths).map(w => ({ wch: w + 2 }));
        
        // Generate and download
        XLSX.writeFile(workbook, `${filename}.xlsx`);
        return true;
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        throw error;
    }
};

/**
 * Export data to PDF file
 * @param {Object} options - PDF options
 * @param {string} options.title - Document title
 * @param {Array} options.columns - Column definitions [{header, key}]
 * @param {Array} options.data - Data to export
 * @param {string} options.filename - Filename without extension
 * @param {string} options.orientation - 'portrait' or 'landscape'
 */
export const exportToPDF = ({ 
    title = 'Report', 
    columns, 
    data, 
    filename = 'export',
    orientation = 'landscape',
    subtitle = '',
    footer = ''
}) => {
    try {
        const doc = new jsPDF(orientation, 'mm', 'a4');
        
        // Add title
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 14, 20);
        
        // Add subtitle
        if (subtitle) {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(subtitle, 14, 28);
        }
        
        // Add date
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`, 14, subtitle ? 35 : 28);
        
        // Prepare table data
        const tableColumns = columns.map(col => col.header);
        const tableData = data.map(row => 
            columns.map(col => {
                const value = row[col.key];
                if (col.format) {
                    return col.format(value, row);
                }
                return value ?? '-';
            })
        );
        
        // Add table
        autoTable(doc, {
            head: [tableColumns],
            body: tableData,
            startY: subtitle ? 40 : 33,
            styles: {
                fontSize: 8,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: [37, 99, 235],
                textColor: 255,
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250],
            },
            margin: { top: 10, left: 14, right: 14 },
        });
        
        // Add footer with page numbers
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(100);
            
            // Footer text
            if (footer) {
                doc.text(footer, 14, doc.internal.pageSize.height - 10);
            }
            
            // Page number
            doc.text(
                `Halaman ${i} dari ${pageCount}`,
                doc.internal.pageSize.width - 40,
                doc.internal.pageSize.height - 10
            );
        }
        
        // Save
        doc.save(`${filename}.pdf`);
        return true;
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        throw error;
    }
};

/**
 * Format asset data for export
 */
export const formatAssetDataForExport = (assets) => {
    return assets.map((asset, index) => ({
        'No': index + 1,
        'Kode Aset': asset.asset_code || '-',
        'Nama Aset': asset.name || '-',
        'Kategori': asset.category?.name || '-',
        'Lokasi': asset.location?.name || '-',
        'Serial Number': asset.serial_number || '-',
        'Status': getStatusLabel(asset.status),
        'Kondisi': getConditionLabel(asset.condition),
        'Harga Beli': formatCurrencyNumber(asset.purchase_price),
        'Tanggal Beli': formatDateString(asset.purchase_date),
        'Garansi Sampai': formatDateString(asset.warranty_expiry),
        'Pemegang': asset.holder?.name || '-'
    }));
};

/**
 * Format transaction data for export
 */
export const formatTransactionDataForExport = (transactions) => {
    return transactions.map((tx, index) => ({
        'No': index + 1,
        'Tanggal': formatDateTimeString(tx.transaction_date),
        'Tipe': getTransactionTypeLabel(tx.action_type),
        'Kode Aset': tx.asset?.asset_code || '-',
        'Nama Aset': tx.asset?.name || '-',
        'User': tx.employee?.name || '-',
        'Admin': tx.admin?.name || '-',
        'Catatan': tx.notes || '-'
    }));
};

// Helper functions
const getStatusLabel = (status) => {
    const labels = {
        'available': 'Tersedia',
        'assigned': 'Dipinjam',
        'repair': 'Perbaikan',
        'retired': 'Dinonaktifkan',
        'missing': 'Hilang'
    };
    return labels[status] || status || '-';
};

const getConditionLabel = (condition) => {
    const labels = {
        'new': 'Baru',
        'good': 'Baik',
        'fair': 'Cukup',
        'poor': 'Buruk'
    };
    return labels[condition] || condition || '-';
};

const getTransactionTypeLabel = (type) => {
    const labels = {
        'checkout': 'Peminjaman',
        'checkin': 'Pengembalian',
        'transfer': 'Transfer',
        'repair': 'Perbaikan',
        'repair_complete': 'Selesai Perbaikan',
        'dispose': 'Disposal'
    };
    return labels[type] || type || '-';
};

const formatCurrencyNumber = (value) => {
    if (!value) return 'Rp 0';
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
};

const formatDateString = (dateStr) => {
    if (!dateStr) return '-';
    try {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch {
        return dateStr;
    }
};

const formatDateTimeString = (dateStr) => {
    if (!dateStr) return '-';
    try {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateStr;
    }
};
