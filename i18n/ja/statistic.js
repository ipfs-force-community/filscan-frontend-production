const statistic = {
  show_more: '更なる',
  '24h': '24時間',
  '7d': '7日間',
  '30d': '30日',
  year: '1年',
  // power
  power: 'ベースラインとハッシュレートの傾向',
  power_tips:
    'ベースライン基準は、Filecoinに要求されるネットワーク成長規模であり、メインネットがオンラインになったときに2.5EiBであり、年間成長率は100％となる。',
  // パワー推移: テストネットは履歴状態を約36時間分のみ保持
  power_trend_history_note:
    'テストネットの履歴状態は約 36 時間分のみ保持されます。直近 {{range}} を表示しています。',
  power_trend_data_unavailable: 'テストネットの履歴データが不足しています',
  // NV29 説明レイヤー：ローバイトパワーの定義 + アクティベーション高さの縦線 + 増減の説明
  power_trend_scope_note:
    'ローバイトパワー ＝ 満倍率計算力（10×）＋ アップグレード可能計算力（1×）；左軸は倍数加重後の有効計算力',
  power_trend_nv29_line: 'NV29 アクティベーション',
  // タイトル横の「?」アイコンのツールチップ：4 指標（4 線/2 軸）＋ 満倍率計算力の 1 行
  power_trend_tip:
    '有効計算力＝倍数加重後のネットワーク計算力（左軸）；全ネットワークの計算力＝純粋なディスク容量（左軸）；アップグレード可能計算力＝まだ満倍率に達していない容量で、減少する一方（右軸）；計算力増分＝直前のデータ点に対する有効計算力の変化で、正負いずれもあり得る（右軸）。満倍率計算力＝全ネットワークの計算力 − アップグレード可能計算力。',
  power_increase_tip:
    'ノード別の計算力増減：レガシーセクターが 10× にアップグレードされると、新しいハードウェアなしでも有効計算力が上昇します',
  power_decrease_tip: 'ノード別の計算力減少（セクター終了・満了を含む）',
  trend_24: '24h基础手续费走势',
  total_raw_byte_power: '全ネットーワークの計算力',
  base_line_power: 'ベースライントレンド',
  change_quality_adj_power: '計算力増分',
  total_quality_adj_power: '計算能力を高める',
  gas: '基本手数料トレンド',
  base_fee: '基本手数料',
  gas_in_32g: '32GiBディスクセクターGas消耗',
  gas_in_64g: '64GiBディスクセクターGas消耗',
  //24_gas
  gas_24: '24h Gas データ',
  method_name: 'メッセージタイプ',
  avg_gas_premium: 'Gas Premium',
  avg_gas_limit: '平均Gas制限',
  avg_gas_used: '平均Gas消耗',
  avg_gas_fee: '平均手数料',
  'sum_gas_fee/ratio': '手数料合計/割合',
  'message_count/ratio': 'メッセージ数合計/割合',
  //fil
  TokenRules: 'Filecoinトークンの割り当てルール',
  FilecoinFoundation: 'Filecoin基金会',
  FundraisingRemainder: '募资 – 剩余通证',
  FundraisingSAFT: '募资 – 未来通证简单协议',
  MiningReserve: '为存储服务提供者预留通证',
  TokenAllocation: '存储提供者通证分配',
  ReservedTokens: '存储提供者预留通证',
  Fundraising: '募资形式 – 未来通证简单协议 2017',
  Funds: '募资形式 – 剩余资金',
  protocolLab: '协议实验室',
  Contributors: '协议实验室团队和贡献者',
  Allocation: '分配项目',
  value: '数额',
  description: '具体用途',
  filBase: 'FIL的基础发放',
  filBase_des: '网络FIL铸造上限',
  ReservedTokens_des:
    '为未来Filecoin经济增长而预留的通证储备，具体未来使用方案由Filecoin社区决定',
  TokenAllocation_des: '通过区块奖励、网络初始化等方式分给存储提供者的通证奖励',
  Fundraising_des: '2017年出售的通证',
  Funds_des: '用作生态发展和后续融资',
  protocolLab_des: '用作协议实验室的相关工作',
  Contributors_des: '4.5%给协议实验室团队和贡献者',

  //charts
  pie_title: '图表统计',
  block_trend: '区块奖励',
  block_reward_streams: 'ブロック報酬の流れ',
  reward_stream_miner: 'マイナー',
  reward_stream_service: 'サービスストリーム',
  reward_stream_burn: 'バーン',
  reward_stream_nv29_line: 'NV29以降、ブロック報酬は重みに応じて分配されます',
  block_reward_per_TiB: '产出效率',
  acc_block_rewards: '累计区块奖励',
  active_nodes: '活跃节点数',
  active_miner_count: '节点数量',
  power_multiplier_trend: '算力倍率構成の推移',
  full_multiplier_power: '満倍率算力（10×）',
  pending_upgrade_power: 'アップグレード可能算力',
  avg_multiplier: '平均品質倍率',
  power_multiplier_nv29_line:
    'NV29以降、算力倍率はコンテンツに依存しなくなります',
  messages_trend: '消息数走势图',
  message_count: '单消息走势',
  all_message_count: '总消息走势',
}

export default statistic
