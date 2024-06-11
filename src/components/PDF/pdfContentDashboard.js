import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    container: {
        padding: 60, // Ajusta los márgenes según sea necesario
    },
    header: {
        fontSize: 11, // Tamaño de letra reducido
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subheader: {
        fontSize: 10, // Tamaño de letra reducido
        fontWeight: 'bold',
        marginBottom: 25,
        textAlign: 'center',
    },
    university: {
        fontSize: 9, // Tamaño de letra reducido
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    faculty: {
        fontSize: 9, // Tamaño de letra reducido
        marginBottom: 5,
        textAlign: 'center',
    },
    career: {
        fontSize: 9, // Tamaño de letra reducido
        marginBottom: 25,
        textAlign: 'center',
    },
    paragraph: {
        fontSize: 8, // Tamaño de letra reducido
        marginBottom: 10,
    },
    date: {
        marginTop: 20,
        fontSize: 8,
        marginBottom: 20,
    },
    boldText: {
        fontSize: 8, // Tamaño de letra reducido
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    observations: {
        fontSize: 8, // Tamaño de letra reducido
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
        fontSize: 8, // Tamaño de letra reducido
        marginBottom: 10,
        textAlign: 'center',
    },
});
const PDFContentDashboard = ({ student }) => (
    <Document>
      <Page size="A4" style={styles.page}>
      <View style={styles.container}>
            <Text style={styles.header}>{student.tipo_informe}</Text>
            <Text style={styles.subheader}>{student.titulo}</Text>
            <Text style={styles.university}>UNIVERSIDAD TÉCNICA DE AMBATO</Text>
            <Text style={styles.faculty}>FACULTAD DE INGENIERIA EN SISTEMAS, ELECTRONICA E INDUSTRIAL</Text>
            <Text style={styles.career}>CARRERA DE {student.nombre_carrera}</Text>
          
            <Text style={styles.paragraph}>FECHA:{student.fecha_creacion}</Text>
            <Text style={styles.paragraph}>NOMBRE DEL ESTUDIANTE: {student.nombre1} {student.nombre2} {student.apellido1} {student.apellido2}</Text>
            <Text style={styles.paragraph}>MODALIDAD DE TITULACIÓN: TESIS</Text>
            <Text style={styles.paragraph}>TEMA DEL TRABAJO DE TITULACIÓN: {student.tema_tesis}</Text>
            <Text style={styles.paragraph}>FECHA DE APROBACIÓN DE LA PROPUESTA DEL PERFIL: {student.fecha_aprobacion_tema}</Text>

          
            <Text style={styles.date}>PORCENTAJE DE AVANCE DE ACUERDO AL CRONOGRAMA: {student.porcentaje} %.</Text>
        
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={styles.tableCol1}>
                        <Text style={styles.tableCell}>Fecha</Text>
                    </View>
                    <View style={styles.tableCol2}>
                        <Text style={styles.tableCell}>Actividad</Text>
                    </View>
                </View>
                {student.actividades.map((actividad, index) => (
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
  
          <Text style={styles.observations}>OBSERVACIONES:</Text>
          <Text style={styles.observations}>{student.observaciones}</Text>
          
          <Text style={styles.firma}>_________________________________________</Text>
          <Text style={styles.firma}>NOMBRE Y FIRMA TUTOR TRABAJO TITULACIÓN</Text>
      </View>
      </Page>
    </Document>
  );
  
  export default PDFContentDashboard;