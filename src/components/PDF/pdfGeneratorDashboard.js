import React from 'react';
import { Button } from 'reactstrap';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFContentDashboard from './pdfContentDashboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const PDFGeneratorDashboard = ({ student }) => (
    <PDFDownloadLink document={<PDFContentDashboard student={student} />} fileName="Informe.pdf">
    {({ loading }) => (
        <Button color="warning" disabled={loading}>
            <FontAwesomeIcon icon={faFilePdf} />
        </Button>
    )}
    </PDFDownloadLink>
);

export default PDFGeneratorDashboard;
