#include <criterion/criterion.h>
#include <string.h>
#include <stdlib.h>
#include "main.h"

Test(longestPalindromicSubstring, returns_bab_or_aba_for_babad) {
    char *res = longestPalindromicSubstring("babad");
    cr_assert(res != NULL);
    cr_assert((strcmp(res, "bab") == 0) || (strcmp(res, "aba") == 0));
    free(res);
}

Test(longestPalindromicSubstring, returns_bb_for_cbbd) {
    char *res = longestPalindromicSubstring("cbbd");
    cr_assert_str_eq(res, "bb");
    free(res);
}

Test(longestPalindromicSubstring, returns_a_for_a) {
    char *res = longestPalindromicSubstring("a");
    cr_assert_str_eq(res, "a");
    free(res);
}

Test(longestPalindromicSubstring, returns_aa_for_aa) {
    char *res = longestPalindromicSubstring("aa");
    cr_assert_str_eq(res, "aa");
    free(res);
}

Test(longestPalindromicSubstring, returns_empty_for_empty_input) {
    char *res = longestPalindromicSubstring("");
    cr_assert_str_eq(res, "");
    free(res);
}

Test(longestPalindromicSubstring, returns_anana_for_banana) {
    char *res = longestPalindromicSubstring("banana");
    cr_assert_str_eq(res, "anana");
    free(res);
}

Test(longestPalindromicSubstring, returns_racecar_for_racecar) {
    char *res = longestPalindromicSubstring("racecar");
    cr_assert_str_eq(res, "racecar");
    free(res);
}

Test(longestPalindromicSubstring, returns_madam_for_madam) {
    char *res = longestPalindromicSubstring("madam");
    cr_assert_str_eq(res, "madam");
    free(res);
}

Test(longestPalindromicSubstring, returns_aaaa_for_aaaa) {
    char *res = longestPalindromicSubstring("aaaa");
    cr_assert_str_eq(res, "aaaa");
    free(res);
}
