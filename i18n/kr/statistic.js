const statistic = {
  gas_total: 'Gas',
  show_more: '더 보기',
  '24h': '24시간',
  '7d': '7일',
  '30d': '30일',
  year: '1년',
  // power
  power: '스토리지 파워 추세',
  power_tips:
    '기준선은 Filecoin 네트워크가 요구하는 네트워크 성장 규모이며, 메인넷 출시 때는 2.5EiB이며, 연간 증가율은 100% 입니다.',
  // 파워 추세: 테스트넷은 약 36시간의 이력 상태만 보관
  power_trend_history_note:
    '테스트넷은 약 36시간의 이력 상태만 보관합니다. 최근 {{range}} 데이터를 표시합니다.',
  power_trend_data_unavailable: '테스트넷 이력 데이터가 부족합니다',
  trend_24: '24시간 기본 수수료 추세',
  total_raw_byte_power: '원래 로우바이트 파워',
  base_line_power: '기준선 추세',
  change_quality_adj_power: '연쇄 유효 체굴파워 변화',
  total_quality_adj_power: '유효 체굴파워',
  gas: '기본 수수료 추세',
  base_fee: '기본 수수료',
  gas_in_32g: '32GiB 섹터 Gas 소비',
  gas_in_64g: '64GiB 섹터 Gas 소비',
  //24_gas
  gas_24: '24시간 Gas 데이터',
  method_name: '메시지 유형',
  avg_gas_premium: 'Gas 프리미엄',
  avg_gas_limit: '평균 Gas 한도',
  avg_gas_used: '평균 가스 소비',
  avg_gas_fee: '평균 수수료',
  'sum_gas_fee/ratio': '수수료 합계/비율',
  'message_count/ratio': '메시지 수 합계/비율',
  //fil
  TokenRules: 'Filecoin 토큰 할당 규칙',
  FilecoinFoundation: 'Filecoin 재단',
  FundraisingRemainder: '모금 - 잔여 토큰',
  FundraisingSAFT: '모금 - 미래 토큰 간단 계약',
  MiningReserve: '스토리지 서비스 제공자를 위한 예비 토큰',
  TokenAllocation: '스토리지 제공자 토큰 할당',
  ReservedTokens: '스토리지 제공자 예비 토큰',
  Fundraising: '모금 방식 - 미래 토큰 간단 계약 2017',
  Funds: '모금 방식 - 잔여 자금',
  protocolLab: '프로토콜 실험실',
  Contributors: '프로토콜 실험실 팀 및 기여자',
  Allocation: '항목 배치',
  value: '금액',
  description: '구체적 용도',
  filBase: 'FIL 기본 발급',
  filBase_des: '네트워크에서 FIL 생선 상한',
  ReservedTokens_des:
    '미래 Filecoin 경제 성장을 위해 예비 토큰 저장, 구체적인 사용 방안은 Filecoin 커뮤니티에서 결정됩니다.',
  TokenAllocation_des:
    '블록 보상, 네트워크 초기화 등을 통해 스토리자 제공자에게 발급한 토큰 보상',
  FilecoinFoundation_des:
    '장기적인 커뮤니티 발전과 네트워크 관리를 위해 할당되었습니다',
  Fundraising_des: '2017년 판매된 토큰',
  Funds_des: '생태계 발전 및 후속 자금 용자로 쓰인다',
  protocolLab_des: '프로토콜 실험실 관련 작업용',
  Contributors_des: '4.5%는 프로토콜 실험실 팀 및 기여자에게 지급됩니다.',

  //charts
  pie_title: '차트 통계',
  block_trend: '블록 보상',
  block_reward_streams: '블록 보상 흐름',
  reward_stream_miner: '마이너',
  reward_stream_service: '서비스 스트림',
  reward_stream_burn: '소각',
  reward_stream_nv29_line: 'NV29부터 블록 보상은 가중치에 따라 분배됩니다',
  block_reward_split: '서비스 보상 순위',
  block_trend_tip:
    '마이너 실수령(컨센서스 스트림)만 해당; 서비스 스트림과 소각은 「블록 보상 흐름」을 참고하세요',
  block_reward_per_TiB_tip:
    '마이너 실수령(컨센서스 스트림)만 해당; 서비스 스트림과 소각은 「블록 보상 흐름」을 참고하세요',
  reward_stream_rec_address: '수혜 주소',
  reward_stream_rec_share: '지분',
  reward_stream_rec_rank: '순위',
  reward_stream_rec_claimed: '수령액',
  reward_stream_rec_receivable: '미수금',
  reward_stream_rec_removed: '제거된 스트림',
  reward_stream_rec_removed_tip:
    '이 보상 스트림은 제거되었습니다(또는 주소가 교체됨): 현재 지분표에 없으므로 지분이 0%로 표시됩니다. 여기의 금액은 이전 기간에 발생한 미지급 이월 잔액이며, 아직 청구할 수 있습니다.',
  reward_stream_rec_claimed_tip:
    '이번 기간 수령액: 해당 수혜자가 이번 기간에 보상 풀에서 이미 청구한 금액입니다(기간별 갱신, 누적치 아님).',
  reward_stream_rec_receivable_tip:
    '청구 가능액: 해당 수혜자가 지금 보상 풀에서 인출할 수 있지만 아직 청구하지 않은 FIL입니다(이월된 미지급분 포함).',
  reward_stream_nv29_inactive:
    '이 네트워크에서는 NV29가 아직 활성화되지 않아 블록 보상이 여전히 전액 마이너에게 지급됩니다',
  block_reward_per_TiB: '생산 효율',
  acc_block_rewards: '누적 블록 보상',
  active_nodes: '액티브한 노드 수',
  active_miner_count: '노드 수',
  messages_trend: '메시지 수 추이 그래프',
  message_count: '블록 평균 메시지 추세',
  all_message_count: '총 메시지 추세',
  pie_title_a: '현재 FIL의 용도 분포 통계',
  pie_title_a_tip:
    '제공된 스토리지 제공자 보상 FIL + 해제된 잠긴 블록 보상 FIL + 배치된 보류 부분 FIL = 현재 이미 방출된 FIL',
  pie_title_b: '현재 이미 방출된 FIL 용도 통계',
  mined: '제공된 스토리지 제공자 보상 FIL',
  remaining_mined: '잔여 스토리지 제공자 보상 FIL',
  vested: '해제된 잠긴 블록 보상 FIL',
  remaining_vested: '잔여 잠긴 블록 보상 FIL',
  reserve_disbursed: '배치된 보류 부분 FIL(테스트넷 보상)',
  remaining_reserved: '잔여 보류 부분 FIL',
  locked: '섹터 담보 FIL',
  burnt: '폐기된 FIL',
  circulating: '거래 가능한 유통 FIL',

  power_increase: '순 전력 증가',
  power_decrease: '순 전력 감소',
  //chartsnav

  cc_dc_power: 'CC/DC 전력 추세',
  static_overview: '차트 통계',
  fil_overview: 'FIL 개요',

  contract_trend: '계약 거래',
  charts_title: 'FIL 할당 지침',
  networks_overview: '전체 네트워크 데이터 지표',
  contract_con: '계약 배포 추이',
  contract_counts: '계약 거래 주소',
  contract_gas: '계약 Gas 소비',
  contract_addr: ' 계약 배포',
  contract_balance: '계약 잔액 추세',
  contract_total_balance: '계약 잔액',
  //cw

  'cw-search': '높이/블록 CID 검색',
  cw_des: '다양한 높이를 보려면 드래그하세요',
  cw_top: '최신 키',
}

export default statistic
