const account = {
  date: 'Date',
  copy: 'Copy',
  day: 'Day',
  confirm: 'Confirm',
  cancel: 'Cancel',
  go_home: 'Back to Homepage',
  go_login: 'Login',
  login: 'Miner Metrics',
  back: 'Back',
  account_title: 'Miner Metrics',
  overview: 'Overview',
  miners: 'Miners',
  personal: 'Account',
  data_details: 'Details',
  monitor: 'Monitoring',
  monitorBalance: 'Balance',
  monitorSector: 'Expiration',
  monitorPower: 'Power',
  logout: 'Logout',
  default_group: 'Default Group',
  welcome: 'Welcome to Filscan!',
  welcome_text1:
    'Congratulations! Your account has been successfully registered! Please login with your email and password.',
  welcome_text2: 'Please login and have fun!',
  last_time: 'Latest Update Time',
  all: 'All',
  all_groups: 'All Groups',
  all_miners: 'All Miners',
  all_tags: 'All Tags',
  edit: 'Edit',
  miner_add: 'Add Miner',
  //个人账户 Personal
  register_success:
    'Congratulations! Your account has been successfully registered!',
  register_btn: 'Activate',
  select_group: 'Please select a group',
  select_miner: 'Please select an miner ',
  select_miner_tag: 'Please select an miner tag',
  edit: 'Operation',
  miner_add: 'Add',
  edit_write: 'Modify',
  edit_delete: 'Delete',
  created_at: 'Created Time',

  //数据概览 Data Overview
  // power: '算力概览',
  // gas: 'Gas 消耗',
  // expired: '到期扇区',
  // reward: '出块奖励',
  // lucky: '幸运值',
  // balance: '地址余额',
  power: 'Power Overview',
  gas: 'Gas',
  expired: 'Sector Status',
  reward: 'Reward',
  lucky: 'Lucky',
  balance: 'Balance Overview',
  no_node_data: 'No Node',
  miners_add: 'Add Miner',
  group_add: 'Add Group',
  miners_group_manage: 'Manage Miners Group',
  total_out_come_gas: 'Total Cost/Gas Cost',
  pledge_amount_24: 'FIL Pledged/24H Changes',
  balance_24: 'Total Balance/24H Changes',
  quality_power_24: 'Quality Power/24H Changes',

  //节点管理 Miner Manager
  delete_group: 'Delete Group',
  delete_record_group: 'Confirm？',
  delete_group_text:
    'This group will no longer be displayed in the list after deletion!',

  delete_miner: 'Delete Miner',
  delete_record_miner: 'Are you sure you want to delete the miner?',
  delete_miner_text: 'This miner will no longer be displayed in the group',

  //添加节点 Add Miner
  custom_tag: 'Custom Tag',
  miner_add_placeholder: 'Please enter the Miner account ID ',
  miner_select_group_placeholder:
    'Please select a group(if no group is selected, the added miner will be placed in the" Default Group")',

  //分组
  create_group: 'Create Group',
  create_group_holder: 'Please enter name of the group you want to create.',
  item_value: '{{value}} miner in this group',
  group_name: 'Group Name',

  //幸运值 Lucky
  all: 'All',
  '24h_lucky': '24H Lucky    ',
  '7d_lucky': '7D Lucky',
  '30d_lucky': '30D Lucky',
  '1year_lucky': '1 Year Lucky',
  tag: 'Tag',
  miner_id: 'Miner ID',

  //地址余额 Address Balance
  miner_balance: 'Miner Balance/Daily Change',
  owner_balance: 'Owner Balance/Daily Change',
  worker_balance: 'Worker Balance/Daily Change',
  controller_0_balance: 'Controller0 Balance/Daily Change',
  controller_1_balance: 'Controller1 Balance/Daily Change',
  controller_2_balance: 'Controller2 Balance/Daily Change',
  beneficiary_balance: 'Beneficiary Balance/Daily Change',
  market_balance: 'Market Balance/Daily Change',

  //奖励 Reward
  block_count: 'Block Count',
  win_count: 'Win Count',
  block_reward: 'Block Reward',
  total_reward: 'Total Reward',
  total_reward_24: 'Total Reward/24H Reward',

  //算力概览 Power Overview
  quality_power: 'Quality Power',
  full_multiplier_power: 'Full-multiplier power',
  raw_power: 'Raw Power',
  pending_upgrade_power: 'Pending upgrade power',
  sector_size: 'Sector Size',
  sector_power_change: 'Sector Change',
  sector_power_count: 'Sector Count',
  sector_count_change: 'Sector Count Change',
  pledge_changed: 'Pledge Change',
  pledge_changed_per_t: 'Pledge Change/T',
  penalty: 'Penalty',
  fault_sectors: 'Fault Sectors',

  sector_power_change_tip:
    'Sector Count/RawBytePower  The sum of additions and terminations',
  pledge_changed_tip:
    'The sum of changes in pledge for additions and terminations of Sector Count',
  pledge_changed_per_t_tip: 'Pledge change devided by sector change.',
  penalty_tip: 'The amount of FIL subjected to Penalty',
  fault_sectors_tip: 'The number of newly added faulty sectors.',
  total_gas_cost_tip: 'The total sum of gas consumption for all types.',
  seal_gas_cost_tip:
    'The total sum of gas cost for sector sealing(PreCommitSector+ProveCommitSector+PreCommitSectorBatch+ProveCommitAggregate+PreCommit Net Fee+ProveCommit Net Fee)',
  seal_gas_per_t_tip: 'Gas consumption per newly sealed sector (TiB)',
  deal_gas_cost_tip: 'DC consumption of PublishStorageDeals',
  wd_post_gas_cost_tip: 'Consumption of SubmitWindowedPoSt',
  wd_post_gas_per_t_tip: 'SubmitWindowedPoSt cost devided by RawBytePower(TiB)',
  //gas
  total_gas_cost: 'Total Gas Cost',
  seal_gas_cost: 'Seal Gas Cost',
  seal_gas_per_t: 'Seal Gas Cost/T',
  deal_gas_cost: 'Deal Gas Cost',
  wd_post_gas_cost: 'Wd Post Gas Cost',
  wd_post_gas_per_t: 'Wd Post Gas Cost/T',

  //到期扇区 Exp. Sector
  exp_month: 'Expires in {{value}} year {{value}} month',
  exp_time: 'Exp. Time',
  miner_count: 'Miner Count',
  exp_power: 'Exp. Power',
  sector_count: 'Exp. Sector Count',
  exp_dc: 'Exp.DC',
  exp_pledge: 'Exp. Pledge',
  //个人中心 Personal Center
  default_user: 'Regular User',
  last_login: 'Last Login',
  personal_setting: 'Account Setting',
  personal_name: 'Account Name',
  old_placeholder: 'Please enter old password',
  old_password: 'Old Password',
  new_password: 'New Password',
  new_placeholder: 'Please enter new password',
  confirm_password: 'Confirm',
  confirm_placeholder: 'Please enter new password again',
  personal_name_holder: 'Please enter your account name',

  //余额监控
  miner: 'Miner Balance',
  owner: 'Owner Balance',
  worker: 'Worker Balance',
  controller_0: 'Controller0 Balance',
  controller_1: 'Controller1 Balance',
  controller_2: 'Controller2 Balance',
  beneficiary: 'Beneficiary Balance',

  //监控
  add_rules: 'Add Rules',
  examination: 'Rules',
  alarm: 'Alert Methods',
  status: 'State',
  rules_more:
    'A single dialog box can have a maximum of 10 rule sets. If you need to add more, please save your changes and continue',
  warn_more: 'Maximum support for adding 3',
  monitor_mobile_edit_tip:
    'Please go to the PC version for monitoring operations such as adding, deleting, and modifying',
  //告警方式
  warn_title: 'Alert Methods',
  warn_title_des:
    'You can choose one or a combination of alert methods based on the actual situation',
  email_warn: 'Email Alert',
  email_warn_placeholder: 'Please provide the alert email address  ',
  email_warn_warning: 'Please enter a valid email address',
  email_warn_des:
    'The registered email address for the current account will be automatically sent, so there is no need to submit it again',
  message_warn: 'SMS Alert',
  message_warn_placeholder: 'Please provide the receiving phone number ',
  message_warn_warning: 'Please enter a valid recipient number',

  phone_warn: 'Phone Call Alert',
  phone_warn_placeholder: 'Please provide the receiving phone number ',
  phone_warn_warning: 'Please enter a valid recipient number',

  //监控
  ExpireSectorMonitor: 'Sector Expiry Date',
  edit_status: 'Close Rule',
  edit_status_content:
    'Do you confirm the disabled of this monitoring? Once disabled, you will not receive timely alerts for relevant issues',
  delete_rule: 'Delete Rule',
  delete_rule_content: 'Do you confirm the deletion of this monitoring?',

  //扇区监控
  reset_button: 'Reset',
  edit_rules: 'Modify Rules',
  rule_detail: 'Rule Details',
  edit_write_warn: 'Alarm Modes',
  sector_rule_title: 'Sector Expiry Date',
  sector_rule_des: 'Customizable; Recommended to be greater than 30.',
  sector_ruler_placeholder: 'Please enter a positive integer',
  sector_ruler_warningText: 'Please enter a positive integer',
  '<=': 'Less than or equal to',
  '>=': 'Greater than or equal to',
  //余额监控
  balance_category_placeholder: 'select a balance category',
  balance_rule_des: 'current {{value}} FIL',
  //算力监控
  power_rules_1: '1. Sector encountered an error',
  power_rules_2: '2. Sector terminated voluntarily',
  power_rules_3: '3. Sector expired normally',
  //会员
  member_miner_warn:
    'The number of current nodes has reached the limit. Upgrade your membership to enjoy more benefits.',
  member_warn:
    'Your membership privileges are about to expire. Please renew in a timely manner to avoid any disruptions.',
  member_header:
    'If you are concerned or have encountered the following issues',
  power_title: 'Drop In Power',
  power_text:
    'Due to a large number of sector errors, power sharply decreases without timely notification, resulting in significant loss of block rewards',
  balance_title: 'Insufficient Balance',
  balance_text:
    'Insufficient account balance without timely information access leads to failed sector sealing or maintenance',
  sector_title: 'Sector Expiration',
  sector_text:
    'When a sector expires, power also decreases. It is only then that we realize we should have renewed earlier. A reminder would have been helpful',
  warn_power: 'Power',
  warn_balance: 'Balance',
  warn_sector: 'Sectors',
  warn_email: 'Email',
  warn_msg: 'SMS',
  warn_phone: 'Phone Call',
  data_text: 'Comprehensive Monitoring Of Critical Information',
  warn_text: 'Multiple Alert Channels, Flexible Configuration',
  member_warn_title: 'Add Monitoring, Stay Ahead With Alerts',
  member_content_title: 'Join Membership, Activate Instantly',
  companies: 'Enterprise',
  companiesPro: 'Enterprise Pro',
  companies_1: '30 Nodes Limit',
  companies_1_pro: 'Unlimited Nodes',
  companies_2: 'Power',
  companies_3: 'Balance',
  companies_4: 'Sectors',
  companies_5: 'More (coming soon)',
  companies_6: 'Technical support',
  monthly: 'Monthly',
  quarter: 'Quarterly',
  year: 'Annual',
  quarter_discount: 'Less than 12% off',
  year_discount: 'Less than 20% off',
  share_friend:
    'Invite Others And Get One Month Enterprise Membership For Free',
  share_turn: 'Start Now And Minimize Losses',
  tg_title: 'Add Business TG For Activation',
  //活动
  success_member: 'Registered successfully',
  error_member: 'Unbound miners',
  success_miners: 'Bound miners',
  success_active: 'Valid',
  error_active: 'Invitee',
  invitees: 'Invitee',
  is_valid: 'Validity',
  send_member: 'Free VIP',
  invite_code: 'Code',
  active_share: 'Invite Now',
  active_member_warn: 'SMS And Phone Alerts',
  active: 'Invitation',
  active_rule: 'Event Rules',
  active_detail: 'Details',
  active_rule_detail: 'Details',
  rule_content:
    'Accumulate invitations for 2 node managers to register and have their invited accounts bind with valid node information, and receive a one-month Enterprise Edition membership worth 169U. The invitees can also enjoy 7 days of Enterprise Edition benefits',
  active_member: 'Enterprise Edition Membership Benefits:',
  active_member_1: 'Full monitoring capabilities.',
  active_expired:
    'After the membership expires, the benefits will be automatically revoked. You can continue to enjoy the related services by renewing the membership.',
  // active_1: '邀请好友',
  active_1_des:
    'Send invitation posters or invitation codes to friends, they can scan the code or register on the official website with the invitation code.',
  // active_2: '注册添加',
  active_2_des:
    'Your friend has successfully registered and added valid nodes.',
  active_3: '邀请2个有效好友',
  active_3_des: 'Invite 2 valid friends and successfully claim the reward',
  active_target_1: 'Comprehensive Miner Information',
  active_target_2: 'Stay One Step Ahead With Anomaly Alerts',
  scan_code: 'Scan to experience immediately',
  active_des: 'Filscan reserves the right to interpret the activity',
  active_gift: 'New users are granted a 7-day trial of the Enterprise version',
  active_save: 'Save locally',
  copy_tg: 'Copy ID',
  recommend: '推荐',
  //personal
  personal_1: 'Upgrade/Renew VIP',
  // personal_2: '绑定邮箱',
  personal_3: 'Change Password',
  member_expired_time: 'Expires on {{value}}',
  mail_success: 'Bound',
  look_more: 'Benefits',
  look_detail: 'Check the Details',
  look_detail_member: 'For Free',
  //第一次弹窗
  free_send: 'Enterprise Membership For Free',
}

export default account
