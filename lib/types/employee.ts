export interface Employee {
    id: string;
    lastName: string;
    firstName: string;
    cin: string;
    phone: string;
    address: string;
    position: string;
    amount: number;
    hireDate: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEmployeeInput {
    lastName: string;
    firstName: string;
    cin: string;
    phone: string;
    address: string;
    position: string;
    amount: number;
    hireDate: string;
}

export interface UpdateEmployeeInput extends Partial<CreateEmployeeInput> {
    isActive?: boolean;
}
