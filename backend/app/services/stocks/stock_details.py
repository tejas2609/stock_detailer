import yfinance as yf

class StockDetails:
    
    detailsObj = ['yearHigh', 'yearLow', 'previousClose', 'dayHigh', 'dayLow']
    
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
        self.get_stock_details()
        data = yf.download("TATAPOWER.NS", period=self.period, interval=self.interval)
        close_data = data[['Close']]
        close_data.columns = close_data.columns.droplevel(1) 
        stock_data_df = close_data.reset_index()
        
        if 'Datetime' in stock_data_df.columns:
            stock_data_df['Datetime'] = stock_data_df['Datetime'].astype(str)
        elif 'Date' in stock_data_df.columns:
            stock_data_df['Date'] = stock_data_df['Date'].astype(str)

        stock_data = stock_data_df.to_dict(orient="records")
        return stock_data