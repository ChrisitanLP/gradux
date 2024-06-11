// PDFGenerator.js
import React from 'react';
import { Button } from 'reactstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFContent from './pdfContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const PDFGenerator = ({ report }) => (
  <PDFDownloadLink document={<PDFContent report={report} />} fileName="Informe.pdf">
    {({ loading }) => (
      <Button color="warning" disabled={loading}>
        <FontAwesomeIcon icon={faFilePdf} />
      </Button>
    )}
  </PDFDownloadLink>
);

export default PDFGenerator;
