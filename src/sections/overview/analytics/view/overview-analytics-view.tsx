'use client';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
} from 'src/_mock';
import { useGetFinancialStats, useGetPeopleStats, useMilkLogisticStats } from 'src/actions/stats';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { peopleStats, peopleLoading } = useGetPeopleStats();

  const { financialStats, financialLoading } = useGetFinancialStats();

  const { milkLogisticStats } = useMilkLogisticStats();

  console.log(milkLogisticStats);

  const { userTypeBreakdown } = peopleStats || {};
  const { invoiceStatusBuckets, invoiceAging, kpis, purchaseOrderFunnel } = financialStats || {};
  const { quality, billingPeriods, collectionTrend, routes } = milkLogisticStats || {};

  const totalUsers =
    userTypeBreakdown?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 1;

  const percent = (part: number, total: number) => Math.round((part / total) * 100);

  const purchase = purchaseOrderFunnel?.filter((item: any) => item.label === 'Purchase Orders')[0];
  const invoices = purchaseOrderFunnel?.filter((item: any) => item.label === 'Invoices')[0];

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Farmers"
            percent={percent(
              userTypeBreakdown?.find((item: any) => item.userType === 'FARMER')?.count || 0,
              totalUsers
            )}
            color="primary"
            total={userTypeBreakdown?.find((item: any) => item.userType === 'FARMER')?.count || 0}
            icon={
              <img
                alt="icon"
                src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-users.svg`}
              />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Milk Men"
            percent={percent(
              userTypeBreakdown?.find((item: any) => item.userType === 'MILK_MAN')?.count || 0,
              totalUsers
            )}
            total={userTypeBreakdown?.find((item: any) => item.userType === 'MILK_MAN')?.count || 0}
            color="secondary"
            icon={
              <img
                alt="icon"
                src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-users.svg`}
              />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Admins"
            percent={percent(
              userTypeBreakdown?.find((item: any) => item.userType === 'MILK_MAN')?.count || 0,
              totalUsers
            )}
            total={
              userTypeBreakdown?.find((item: any) => item.userType === 'COOPERATIVE_ADMIN')
                ?.count || 0
            }
            color="secondary"
            icon={
              <img
                alt="icon"
                src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-users.svg`}
              />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Extension Officers"
            percent={percent(
              userTypeBreakdown?.find((item: any) => item.userType === 'EXTENSION_OFFICER')
                ?.count || 0,
              totalUsers
            )}
            total={
              userTypeBreakdown?.find((item: any) => item.userType === 'EXTENSION_OFFICER')
                ?.count || 0
            }
            color="error"
            icon={
              <img
                alt="icon"
                src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-users.svg`}
              />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={`Purchase orders (${purchase?.count || 0})`}
            percent={purchase?.count}
            total={purchase?.amount || 0}
            color="warning"
            icon={
              <img alt="icon" src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-buy.svg`} />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title={`Invoices (${invoices?.count || 0})`}
            percent={invoices?.count}
            total={invoices?.amount || 0}
            color="warning"
            icon={
              <img alt="icon" src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-buy.svg`} />
            }
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current KPIs"
            chart={{
              series: [
                { label: 'Disbursed Advance', value: kpis?.advancesDisbursed || 0 },
                { label: 'Outstanding Advance', value: kpis?.advancesOutstanding || 0 },
                { label: 'Amount Paid', value: kpis?.amountPaid || 0 },
                { label: 'Outstanding Balance', value: kpis?.outstandingBalance || 0 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Invoice Aging"
            chart={{
              categories: invoiceAging?.map((item: any) => item.label),
              series: [
                { name: 'Team A', data: invoiceAging?.map((item: any) => item.balance) || [] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Route Distribution"
            // subheader="(+43%) than last year"
            chart={{
              categories: routes?.map((item: any) => item.routeName) || [],
              series: [
                { name: 'quantity', data: routes?.map((item: any) => item.quantity) || [] },
                { name: 'farmers', data: routes?.map((item: any) => item.farmers) || [] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsWidgetSummary
            title="Total Collections"
            percent={0}
            total={quality?.totalCollections}
            color="error"
            icon={
              <img
                alt="icon"
                src={`${CONFIG.site.basePath}/assets/icons/components/ic-table.svg`}
              />
            }
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <Grid xs={12} md={6} lg={8}>
            <AnalyticsWebsiteVisits
              title="Collection by year"
              unit="KES"
              chart={{
                categories: collectionTrend?.map((item: any) => item.period),
                series: [
                  {
                    name: 'Quantity',
                    data: collectionTrend?.map((item: any) => item.quantity) || [],
                  },
                  {
                    name: 'Deliveries',
                    data: collectionTrend?.map((item: any) => item.deliveries) || [],
                  },
                ],
              }}
            />
          </Grid>
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline
            title="Billing Periods"
            list={
              billingPeriods?.map((item: any) => ({
                id: item.id,
                title: item.periodName,
                type: item.status,
                time: item.createdAt,
                totalQuantity: item.totalQuantity,
                totalValue: item.totalValue,
              })) || []
            }
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite title="Traffic by site" list={_analyticTraffic} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_analyticTasks} />
        </Grid> */}
      </Grid>
    </DashboardContent>
  );
}
