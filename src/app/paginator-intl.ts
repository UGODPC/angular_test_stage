import { Service } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Service()
export class PaginatorIntl extends MatPaginatorIntl {
    override getRangeLabel = (page: number, pageSize: number, length: number) => {
        return(`Page ${page + 1} sur ${Math.ceil(length/pageSize)}`) //Math.ceil() pour arrondir à la valeur au dessus pour éviter les floats.
    };
}
