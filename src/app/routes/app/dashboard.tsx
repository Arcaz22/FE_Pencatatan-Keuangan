import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ContentLayout } from '@/components/layout/content-layout';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { PeriodSelector } from '@/features/dashboard/period-selector/period-selector';
import { StatsCard } from '@/features/dashboard/stats/stats-card';
import { PieChart } from '@/features/dashboard/chart/pie-chart';
import { LineChart } from '@/features/dashboard/chart/line-chart';

export const DashboardPage = () => {
  const {
    totalIncome,
    totalExpense,
    balance,
    currentMonth,
    currentYear,
    pieChartData,
    handlePreviousPeriod,
    handleNextPeriod,
    budgetData
  } = useDashboardData();

  return (
    <DashboardLayout>
      <ContentLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <PeriodSelector
              currentMonth={currentMonth}
              currentYear={currentYear}
              onPrevious={handlePreviousPeriod}
              onNext={handleNextPeriod}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Total Pemasukan"
              amount={totalIncome}
              icon={ArrowUpCircle}
              variant="success"
            />
            <StatsCard
              title="Total Pengeluaran"
              amount={totalExpense}
              icon={ArrowDownCircle}
              variant="danger"
            />
            <StatsCard title="Saldo" amount={balance} icon={Wallet} variant="primary" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md h-[400px]">
              <h2 className="text-lg font-semibold mb-4">Tracking Anggaran Bulanan</h2>
              <LineChart data={budgetData} />
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md h-[400px]">
              <h2 className="text-lg font-semibold mb-4">Distribusi Pengeluaran</h2>
              <PieChart
                data={pieChartData}
                colors={[
                  'hsl(var(--bg-info))',
                  'hsl(var(--bg-success))',
                  'hsl(var(--bg-warning))',
                  'hsl(var(--bg-secondary))'
                ]}
              />
            </div>
          </div>
        </div>
      </ContentLayout>
    </DashboardLayout>
  );
};
