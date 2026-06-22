import yfinance as yf
import pandas as pd

class StockDetails:
    
    detailsObj = ['yearHigh', 'yearLow', 'previousClose', 'dayHigh', 'dayLow']
    financialsArr = ['EDITDA', 'Net Income', 'Total Expenses', 'Gross Profit', 'Total Revenue', 'Operating Revenue']
    
    def __init__(self, symbol, interval, period):
        self.symbol = symbol
        self.interval = interval if interval else '1m'
        self.period = period if period else '1d'
        self.ticker = yf.Ticker(self.symbol)

    def get_stock_details(self):
        info = self.ticker.fast_info
        data = []
        for key, value in info.items():
            obj = {}
            if key in self.detailsObj:
                obj['key'] = key
                obj['value'] = value
                data.append(obj)
        return data   

    def get_stock_price(self):
        data = yf.download(self.symbol, period=self.period, interval=self.interval)
        close_data = data[['Close']]
        close_data.columns = close_data.columns.droplevel(1) 
        stock_data_df = close_data.reset_index()
        
        if 'Datetime' in stock_data_df.columns:
            stock_data_df['Datetime'] = stock_data_df['Datetime'].astype(str)
        elif 'Date' in stock_data_df.columns:
            stock_data_df['Date'] = stock_data_df['Date'].astype(str)

        stock_data = stock_data_df.to_dict(orient="records")
        
        result = {}
        income_stmt = self.ticker.income_stmt
        latest_year = income_stmt.columns[0]
        for metric in self.financialsArr:
            if metric in income_stmt.index:
                result[metric] = income_stmt.loc[metric, latest_year]
            else:
                result[metric] = None

        cleaned = {
            k: 0 if pd.isna(v) else int(v)
            for k, v in result.items()
        }
        
        stock_response = {
            'data': stock_data,
            'financials': cleaned
        }
        
        return stock_response