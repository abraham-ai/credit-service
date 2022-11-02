export interface CreditMap {
  credits: number;
}

const creditMap: Record<string, CreditMap> = {
  "1": {
    credits: 1000,
  },
  "2": {
    credits: 100,
  },
};

export default creditMap;
