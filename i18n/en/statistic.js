const statistic = {
  gas_total: 'Gas',
  show_more: 'More',
  '24h': '24H',
  '7d': '7D',
  '30d': '30D',
  year: '1Y',
  // power
  power: 'Storage Power Trend',
  power_tips:
    'The network baseline is the scale of network growth required by the Filecoin Network, which was 2.5 EiB when the Mainnet launched, with a growth rate of 100% per year',
  // Power trend: testnet keeps only ~36h of historical state, so the default interval can't draw a line
  power_trend_history_note:
    'Testnet keeps only ~36h of historical state; showing the last {{range}}',
  power_trend_data_unavailable: 'Insufficient testnet historical data',
  // NV29 explanation layer: QA definition + activation-height vertical line + bar hovers
  power_trend_scope_note:
    'QualityAdjPower = Full-multiplier power (10×) + Upgradable power (1× tier)',
  power_trend_nv29_line: 'NV29 activated',
  power_increase_tip:
    'Per-miner power change: upgrading legacy sectors to 10× raises quality-adjusted power without new hardware',
  power_decrease_tip: 'Per-miner power loss (sector termination / expiration)',
  trend_24: '24h Base Fee Variations',
  total_raw_byte_power: 'Net RawBytePower',
  base_line_power: 'BaseLine',
  power_increase: 'Net Power Increase',
  power_decrease: 'Net Power Decrease',
  total_quality_adj_power: 'QualityAdjPower',
  change_quality_adj_power: 'QualityAdjPower Fluctuations',
  gas: 'Base Fee Variations',
  base_fee: 'Base Fee',
  gas_in_32g: 'Gas Cost of Sealing a 32GiB Sector',
  gas_in_64g: 'Gas Cost of Sealing a  64GiB Sector',
  //24_gas
  gas_24: '24h Gas Data',
  method_name: 'Message Type',
  avg_gas_premium: 'Gas Premium',
  avg_gas_limit: 'Avg. Gas Limit',
  avg_gas_used: 'Avg.Gas Cost',
  avg_gas_fee: 'Avg. Gas Fee',
  'sum_gas_fee/ratio': 'Total Fees/Percentage',
  'message_count/ratio': 'Total Messages/Percentage',
  //fil
  TokenRules: 'FIL Allocation',
  FilecoinFoundation: 'Filecoin Foundation',
  FundraisingRemainder: 'Fundraising-Remainder',
  FundraisingSAFT: 'Fundraising-SAFT',
  MiningReserve: 'Mining Reserve',
  TokenAllocation: 'Storage Mining Allocation',
  ReservedTokens: 'Mining Reserve',
  Fundraising: 'Fundraising - SAFT 2017',
  Funds: 'Fundraising - Remainder',
  protocolLab: 'Protocol Labs',
  Contributors: 'PL Team &amp; Contributors',
  Allocation: 'Allocation',
  value: 'Value',
  description: 'Description',
  filBase: 'FIL BASE',
  filBase_des: 'The maximum amount of FIL that will ever be created.',
  ReservedTokens_des:
    'Tokens reserved for funding mining to support growth of the Filecoin Economy, whose future usage will bedecided by the Filecoin community.',
  TokenAllocation_des:
    'The amount of FIL allocated tostorage nodes through block rewards, network initialization, etc.',
  Fundraising_des: '2017 TOKEN SALE',
  FilecoinFoundation_des:
    'Allocated towards long-term community development and the management of the network.',
  Funds_des: 'Allocated for ecosystem development, future fundraising',
  protocolLab_des: 'Allocated for Protocol Labs',
  Contributors_des: '4.5% for the PL team & contributors',

  //charts
  pie_title: 'Chart Statistics',
  block_trend: 'Block Rewards',
  block_reward_streams: 'Block Reward Streams',
  reward_stream_miner: 'Miner',
  reward_stream_service: 'Service Stream',
  reward_stream_burn: 'Burn',
  reward_stream_nv29_line: 'Since NV29 block rewards are split by weight',
  block_reward_split: 'Service Reward Ranking',
  block_trend_tip:
    'Miner actual receipts (consensus stream) only; see Block Reward Streams for the service stream and burn',
  block_reward_per_TiB_tip:
    'Miner actual receipts (consensus stream) only; see Block Reward Streams for the service stream and burn',
  reward_stream_rec_address: 'Beneficiary',
  reward_stream_rec_share: 'Current share',
  reward_stream_rec_rank: 'Rank',
  reward_stream_rec_claimed: 'Claimed (current)',
  reward_stream_rec_receivable: 'Total receivable',
  reward_stream_rec_removed: 'Removed stream',
  reward_stream_rec_removed_tip:
    'This reward stream was removed (or the address was replaced): it is no longer in the current share table, so its share shows 0%. The amount here is a carry-over balance owed from earlier periods and can still be claimed.',
  reward_stream_rec_zero_share: 'No current share',
  reward_stream_rec_zero_share_tip:
    'This recipient is still listed in the service stream share table but its current share is 0% (the stream allocated it no weight this round), so nothing new accrues. The amount here is a carry-over balance owed from earlier periods and can still be claimed.',
  reward_stream_rec_departed: 'Left this period',
  reward_stream_rec_departed_tip:
    'Left this period: this recipient held a share during the current period but is no longer in the on-chain share table (removed or re-addressed). Its share shows 0.00% and the amount keeps the carry-over it had not claimed when it left. Left at epoch {{left_epoch}}; share before leaving {{last_share_pct}}%.',
  reward_stream_rec_claimed_tip:
    'Claimed (current period): what this recipient has already withdrawn from the reward pool in the current chain period (91 days on mainnet, 1 day on testnet). Rolls over each period; not a cumulative total.',
  reward_stream_rec_claimed_total: 'Total claimed',
  reward_stream_rec_claimed_total_tip:
    'Total claimed: everything this beneficiary has withdrawn from the reward pool to date (aggregated by period; not just the current period).',
  reward_stream_rec_claimed_total_since: 'Valid since epoch {{since}}',
  reward_stream_rec_receivable_tip:
    'Total receivable: everything this recipient is still owed and has not withdrawn - the current period accrual not yet claimed plus carry-over settled in prior periods (on-chain Payable), including leftovers from removed streams.',
  reward_stream_rec_pending_current: 'Current receivable',
  reward_stream_rec_pending_current_tip:
    'Current receivable: this period accrual (on-chain Accrued x current share) minus what was claimed this period, floored at 0.',
  reward_stream_rec_share_tip:
    'Current share: this recipient share in the current chain period (share / 1e18). Share is period-scoped and is never accumulated across periods.',
  reward_stream_nv29_inactive:
    'NV29 is not yet active on this network; block rewards still go entirely to miners',
  block_reward_per_TiB: 'Output Efficiency',
  active_nodes: 'Active Storage Providers',
  active_miner_count: 'Node Counts',
  messages_trend: 'Message Trend',
  message_count: 'Message Trend of Each Block',
  all_message_count: 'Messages Variation per Block',
  all_message_count_tip: 'Messages Included per Block',
  acc_block_rewards: 'Cumulative Block Rewards',
  pie_title_a: 'Current statistics on the distribution of FIL usage',
  pie_title_a_tip:
    'Total FIL Rewarded + Locked Rewards Released + Reserved FIL Allocated = Currently Released Fil',
  pie_title_b: 'Released FIL Usage Statistics',
  mined: 'Total FIL Rewarded',
  remaining_mined: 'Total FIL to Reward',
  vested: 'Locked Rewards Released',
  remaining_vested: 'Locked Rewards to Release',
  reserve_disbursed: 'Reserved FIL Allocated(Testnet Rewards)',
  remaining_reserved: 'Reserved FIL to Allocate',
  locked: 'Total Sector Pledge',
  burnt: 'Total FIL Burned',
  circulating: 'Circulating Supply',

  //chartsnav
  power_multiplier_trend: 'Power multiplier structure',
  full_multiplier_power: 'Full-multiplier power (10×)',
  pending_upgrade_power: 'Upgradable power (1× tier)',
  avg_multiplier: 'Average quality multiplier',
  power_multiplier_nv29_line:
    'Since NV29 the power multiplier no longer changes with content',
  static_overview: 'Statistics',
  contract_trend: 'Contract Transaction',
  fil_overview: 'FIL Overview',
  charts_title: 'FIL Allocation Guidelines',
  networks_overview: 'Network Overview',
  contract_con: 'Trend of Contract Deployment',
  contract_counts: 'Contract Deployment',
  contract_gas: 'Contract Gas Cost',
  contract_addr: 'Contract Transaction Address',
  contract_balance: 'Contract Balance Trend',
  contract_total_balance: 'Contract Balance',
  //cw
  'cw-search': 'Search height/block cid',
  cw_des: 'Drag To See Different Heights',
  cw_top: 'Latest Height',
}

export default statistic
