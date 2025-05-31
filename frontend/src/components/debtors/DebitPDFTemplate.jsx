import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatCurrency, formatDate } from '../../utils/format';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#374151',
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '40%',
    fontSize: 12,
    color: '#6b7280',
  },
  value: {
    width: '60%',
    fontSize: 12,
    color: '#1f2937',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
    paddingVertical: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: '#1f2937',
  },
  status: {
    fontSize: 10,
    padding: '2 6',
    borderRadius: 4,
  },
  statusPaid: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  signatureSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  signatureLine: {
    borderBottom: '1 solid #000',
    width: '200px',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 10,
    color: '#6b7280',
  },
  signatureImage: {
    width: 150,
    height: 50,
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 10,
  },
});

const DebitPDFTemplate = ({ debtor, debit, repayments, signature }) => (
    
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Debit Report</Text>
        <Text style={styles.subtitle}>Generated on {formatDate(new Date())}</Text>
      </View>

      {/* Debtor Information */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Debtor Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{debtor.debtorName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{debtor.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{debtor.contactNumber || 'N/A'}</Text>
        </View>
      </View>

      {/* Debit Information */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Debit Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{debit.description}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{debit.type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Issue Date:</Text>
          <Text style={styles.value}>{formatDate(debit.issueDate)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Due Date:</Text>
          <Text style={styles.value}>{formatDate(debit.dueDate)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Amount:</Text>
          <Text style={styles.value}>{formatCurrency(debit.debitAmount)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Repayments:</Text>
          <Text style={styles.value}>{formatCurrency(debit.totalRepayments || 0)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Remaining Amount:</Text>
          <Text style={styles.value}>{formatCurrency(debit.debitAmount - (debit.totalRepayments || 0))}</Text>
        </View>
      </View>

      {/* Repayments Table */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Repayment Schedule</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Amount</Text>
            <Text style={styles.tableHeaderCell}>Date</Text>
            <Text style={styles.tableHeaderCell}>Status</Text>
          </View>
          {repayments.map((repayment, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{formatCurrency(repayment.repaymentAmount)}</Text>
              <Text style={styles.tableCell}>{formatDate(repayment.repaymentDate)}</Text>
              <Text style={[styles.tableCell, styles.status, repayment.paid ? styles.statusPaid : styles.statusPending]}>
                {repayment.paid ? 'Paid' : 'Pending'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Signature Section */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Authorization</Text>
        {signature ? (
          <View style={styles.signatureSection}>
            <Image src={signature} style={styles.signatureImage} />
            <Text style={styles.signatureText}>Authorized Signature</Text>
          </View>
        ) : (
          <View style={styles.signatureSection}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Authorized Signature</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        {signature 
          ? 'This document has been electronically signed and is valid without a physical signature.'
          : 'This is a computer-generated document. No signature is required.'}
      </Text>
    </Page>
  </Document>
);

export default DebitPDFTemplate; 