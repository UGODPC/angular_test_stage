export class User {
    constructor(
        public id: number = 0,
        public firstName: string = '',
        public lastName: string = '',
        public login: string = '',
        public roles: string[] = [],
        public permissions: string[] = [],
        public enable: boolean = false,
        public username: string = '',
        public authorities: string[] = [],
        public accountNonExpired: boolean = false,
        public accountNonLocked: boolean = false,
        public credentialsNonExpired: boolean = false
    ) {}
}