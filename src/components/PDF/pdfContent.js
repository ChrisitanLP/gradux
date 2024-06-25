import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    padding: 60,
  },
  header: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  university: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  faculty: {
    fontSize: 9,
    marginBottom: 5,
    textAlign: 'center',
  },
  career: {
    fontSize: 9,
    marginBottom: 25,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 8,
    marginBottom: 10,
  },
  date: {
    marginTop: 20,
    fontSize: 8,
    marginBottom: 20,
  },
  boldText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  observations: {
    fontSize: 8,
    marginBottom: 25,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 25,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol1: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol2: {
    width: "75%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 5,
    fontSize: 8,
  },
  firma: {
    fontSize: 8,
    marginBottom: 10,
    textAlign: 'center',
  },
});

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getEndOfMonthDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = new Date(year, today.getMonth() + 1, 0).getDate();
  return `${year}-${month}-${day}`;
};

const PDFContent = ({ report, useEndOfMonth = false }) => {
  const date = useEndOfMonth ? getEndOfMonthDate() : getCurrentDate();
  const dateMessage = useEndOfMonth
    ? 'El PDF se genera con la fecha de fin de mes.'
    : 'El PDF se genera con la fecha actual.';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <Text style={styles.header}>{report.tipo_informe}</Text>
          <Text style={styles.subheader}>{report.titulo}</Text>
          <Text style={styles.university}>UNIVERSIDAD TÉCNICA DE AMBATO</Text>
          <Text style={styles.faculty}>FACULTAD DE INGENIERIA EN SISTEMAS, ELECTRONICA E INDUSTRIAL</Text>
          <Text style={styles.career}>CARRERA DE {report.nombre_carrera}</Text>

          <Text style={styles.paragraph}>FECHA: {report.fecha_creacion}</Text>
          <Text style={styles.paragraph}>NOMBRE DEL ESTUDIANTE: {report.nombre_completo_estudiante}</Text>
          <Text style={styles.paragraph}>MODALIDAD DE TITULACIÓN: Tesis</Text>
          <Text style={styles.paragraph}>TEMA DEL TRABAJO DE TITULACIÓN: {report.tema_tesis}</Text>
          <Text style={styles.paragraph}>FECHA DE APROBACIÓN DE LA PROPUESTA DEL PERFIL: {report.fecha_aprobacion}</Text>

          <Text style={styles.date}>PORCENTAJE DE AVANCE DE ACUERDO AL CRONOGRAMA: {report.porcentaje} %.</Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol1}>
                <Text style={styles.tableCell}>Fecha</Text>
              </View>
              <View style={styles.tableCol2}>
                <Text style={styles.tableCell}>Actividad</Text>
              </View>
            </View>
            {report.actividades.map((actividad, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol1}>
                  <Text style={styles.tableCell}>{actividad.fecha_Actividad}</Text>
                </View>
                <View style={styles.tableCol2}>
                  <Text style={styles.tableCell}>{actividad.nombreActividad}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.observations}>OBSERVACIONES: {report.observaciones}</Text>

          <Text style={styles.date}>{dateMessage}</Text>

          <Text style={styles.firma}>_________________________________________</Text>
          <Text style={styles.firma}>NOMBRE Y FIRMA TUTOR TRABAJO TITULACIÓN</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFContent;

