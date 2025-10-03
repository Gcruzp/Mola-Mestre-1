"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const TEST_STOCKS = ["PETR4", "MGLU3", "VALE3", "ITUB4"];

interface Stock {
  symbol: string;
  shortName: string;
  longName?: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
  marketCap?: number;
  logourl?: string;
}

async function fetchStocks(symbols: string[]): Promise<Stock[]> {
  const { data } = await axios.get(`https://brapi.dev/api/quote/${symbols.join(",")}?fundamental=true`);
  return data.results || [];
}

const format = {
  volume: (v: number) =>
    v >= 1e9 ? `${(v / 1e9).toFixed(1)}B` :
    v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` :
    v >= 1e3 ? `${(v / 1e3).toFixed(1)}K` : v.toString(),
  cap: (v?: number) =>
    !v ? "N/A" :
    v >= 1e12 ? `R$ ${(v / 1e12).toFixed(1)}T` :
    v >= 1e9 ? `R$ ${(v / 1e9).toFixed(1)}B` :
    `R$ ${v.toFixed(0)}`,
  name: (n: string) => (n.length > 18 ? n.slice(0, 18) + "..." : n),
  color: (c: number) => (c > 0 ? "text-green-600" : c < 0 ? "text-red-600" : "text-gray-600"),
  bg: (c: number) => (c > 0 ? "bg-green-50 border-green-200" : c < 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200")
};

function StockCard({ stock }: { stock: Stock }) {
  const change = stock.regularMarketChangePercent;
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${format.bg(change)}`}>
      <div className="flex items-center gap-3">
        {stock.logourl ? (
          <img src={stock.logourl} alt={stock.symbol} className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-green-400 text-white font-bold">
            {stock.symbol.slice(0, 2)}
          </div>
        )}
        <div>
          <div className="font-bold">{stock.symbol}</div>
          <div className="text-xs text-gray-600">{format.name(stock.shortName || stock.longName || stock.symbol)}</div>
          <div className="text-xs text-gray-400">{format.cap(stock.marketCap)}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold">R$ {stock.regularMarketPrice.toFixed(2)}</div>
        <div className={`text-sm font-semibold ${format.color(change)}`}>{change.toFixed(2)}%</div>
        <div className="text-xs text-gray-500">Vol: {format.volume(stock.regularMarketVolume)}</div>
      </div>
    </div>
  );
}

export function TopStocksTable() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stocks"],
    queryFn: () => fetchStocks(TEST_STOCKS),
    refetchInterval: 30000,
  });

  if (error) return <div className="text-red-600 p-4">Erro ao carregar dados</div>;

  const stocks = (data || []).filter(s => s.regularMarketPrice > 0)
    .sort((a, b) => b.regularMarketChangePercent - a.regularMarketChangePercent);

  const topGainers = stocks.filter(s => s.regularMarketChangePercent > 0).slice(0, 3);
  const topLosers = stocks.filter(s => s.regularMarketChangePercent < 0).slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>IBOVESPA {isLoading && "(Atualizando...)"}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-green-600 font-bold mb-2">📈 Maiores Altas</h3>
          {topGainers.length ? topGainers.map(s => <StockCard key={s.symbol} stock={s} />) : <p>Nenhuma alta</p>}
        </div>
        <div>
          <h3 className="text-red-600 font-bold mb-2">📉 Maiores Baixas</h3>
          {topLosers.length ? topLosers.map(s => <StockCard key={s.symbol} stock={s} />) : <p>Nenhuma baixa</p>}
        </div>
      </CardContent>
    </Card>
  );
}
