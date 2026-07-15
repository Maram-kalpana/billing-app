import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReportContext = createContext();

const REPORTS_KEY = '@reports';

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const stored = await AsyncStorage.getItem(REPORTS_KEY);
      if (stored) {
        setReports(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const addReport = async (report) => {
    const newReport = {
      id: `rpt_${Date.now()}`,
      ...report,
      status: 'Completed',
    };
    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    try {
      await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(updatedReports));
    } catch (error) {
      console.error('Error saving report:', error);
    }
    return newReport;
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        isLoaded,
        addReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
