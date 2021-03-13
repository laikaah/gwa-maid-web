export function verify_local_storage(): boolean{
    if (Storage !== void(0)){
        return true;
    }
    return false;
}