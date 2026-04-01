import React, { useEffect, useMemo } from 'react';
import { 
  Package, 
  TrendingUp, 
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  Minus,
} from 'lucide-react';
import { useAdminStore, type DashboardStats } from '../../store/adminStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

const StatCard = ({ title, value, icon: Icon, change }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change: number | null;
}) => {
  const isPositive = change !== null && change >= 0;
  return (
    <Card className="border-neutral-100 shadow-sm overflow-hidden relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-widest text-neutral-400">{title}</CardTitle>
        <div className="p-2 bg-neutral-50 rounded-lg">
          <Icon className="w-4 h-4 text-neutral-900" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== null ? (
          <p className="text-xs mt-1 flex items-center gap-1">
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3 text-green-500" />
            ) : (
              <ArrowDownRight className="w-3 h-3 text-red-500" />
            )}
            <span className={isPositive ? 'text-green-600' : 'text-red-600'}>{Math.abs(change)}%</span>
            <span className="text-neutral-400 font-medium ml-1">vs last month</span>
          </p>
        ) : (
          <p className="text-xs mt-1 flex items-center gap-1 text-neutral-400">
            <Minus className="w-3 h-3" />
            <span>No prior data</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

function InsightsPanel({ stats, totalOrders }: { stats: DashboardStats; totalOrders: number }) {
  const { ordersByStatus, revenueByCategory, topCategory } = stats;

  const fulfilledCount = (ordersByStatus['delivered'] || 0) + (ordersByStatus['shipped'] || 0);
  const fulfillmentRate = totalOrders > 0 ? Math.round((fulfilledCount / totalOrders) * 100) : 0;

  const pendingCount = ordersByStatus['pending'] || 0;
  const pendingRate = totalOrders > 0 ? Math.round((pendingCount / totalOrders) * 100) : 0;

  const totalCategoryRevenue = Object.values(revenueByCategory).reduce((a, b) => a + b, 0);
  const topCatRevenue = revenueByCategory[topCategory] || 0;
  const topCatPct = totalCategoryRevenue > 0 ? Math.round((topCatRevenue / totalCategoryRevenue) * 100) : 0;

  const insightText = totalOrders === 0
    ? 'No orders yet. Once orders start coming in, insights will appear here automatically.'
    : `${topCategory !== 'N/A' ? `"${topCategory}" drives ${topCatPct}% of revenue.` : ''} ${pendingCount > 0 ? `You have ${pendingCount} pending order${pendingCount > 1 ? 's' : ''} to process.` : 'All orders are being processed.'}`;

  return (
    <CardContent className="space-y-6">
      <ProgressBar label="Fulfillment Rate" value={fulfillmentRate} />
      <ProgressBar label="Pending Orders" value={pendingRate} />
      <ProgressBar label={`Top: ${topCategory}`} value={topCatPct} />
      <div className="pt-4">
        <p className="text-xs text-white/80 leading-relaxed">{insightText}</p>
      </div>
    </CardContent>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/90">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-amber-600 rounded-full overflow-hidden">
        <div className="h-full bg-white transition-all duration-500" style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}

export const DashboardHome: React.FC = () => {
  const { orders, fetchProducts, fetchOrders, fetchDashboardStats, dashboardStats } = useAdminStore();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchDashboardStats();
  }, [fetchProducts, fetchOrders, fetchDashboardStats]);

  const revenueChange = useMemo(() => {
    if (!dashboardStats) return null;
    return pctChange(dashboardStats.currentMonth.revenue, dashboardStats.previousMonth.revenue);
  }, [dashboardStats]);

  const ordersChange = useMemo(() => {
    if (!dashboardStats) return null;
    return pctChange(dashboardStats.currentMonth.orderCount, dashboardStats.previousMonth.orderCount);
  }, [dashboardStats]);

  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          icon={TrendingUp} 
          change={revenueChange} 
        />
        <StatCard 
          title="Total Orders" 
          value={orders.length} 
          icon={ShoppingCart} 
          change={ordersChange} 
        />
        <StatCard 
          title="Total Products" 
          value={dashboardStats?.totalProducts ?? '—'} 
          icon={Package} 
          change={null} 
        />
        <StatCard 
          title="Newsletter Subscribers" 
          value={dashboardStats?.newsletterCount ?? '—'} 
          icon={Mail} 
          change={null} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-neutral-100 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {orders.length === 0 && (
                <p className="text-sm text-neutral-400">No orders yet.</p>
              )}
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-600 text-xs">
                      {order.customer.firstName[0]}{order.customer.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{order.customer.firstName} {order.customer.lastName}</p>
                      <p className="text-xs text-neutral-400">{order.customer.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">+${order.total.toLocaleString()}</p>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-tighter">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-100 shadow-sm bg-amber-500 text-white">
          <CardHeader>
            <CardTitle className="text-white">Store Insights</CardTitle>
          </CardHeader>
          {dashboardStats ? (
            <InsightsPanel stats={dashboardStats} totalOrders={orders.length} />
          ) : (
            <CardContent>
              <p className="text-xs text-white/80">Loading insights...</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};
