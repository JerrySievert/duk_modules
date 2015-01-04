/*
 *  Identify module
 */

/* Include duktape.h and whatever platform headers are needed. */
#include "duktape.h"

/*
 *  Duktape/C functions providing module functionality.
 */

static duk_ret_t run_in_this_context (duk_context *ctx) {
    /* ... */

    const char *buf;

    buf = duk_get_string(ctx, -1);
    duk_compile_string(ctx, 0, buf);
    duk_call(ctx, 0);

    return 1;
}


/* ... */

/*
 *  Module initialization
 */

static const duk_function_list_entry vm_funcs[] = {
    { "runInThisContext", run_in_this_context, 1 /*nargs*/ },
    { NULL, NULL, 0 }
};


duk_ret_t dukopen_vm(duk_context *ctx) {

  //duv_ref_setup(ctx);

  // Create a uv table on the global
  duk_push_object(ctx);
  duk_put_function_list(ctx, -1, vm_funcs);
  return 1;
}