
export interface Territory {
  id: string;
  name: string;
  boundaries: {
    lat: number;
    lng: number;
  }[];
  color: string;
  outletCount: number;
  salesRep?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TerritoryAssignment {
  territoryId: string;
  outletIds: string[];
}

