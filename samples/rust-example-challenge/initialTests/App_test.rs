#[cfg(test)]
mod tests_initial {
    use crate::app::longest_palindromic_substring as lps;

    /// Returns 'bab' or 'aba' for s="babad"
    #[test]
    fn babad_returns_bab_or_aba() {
        let res = lps("babad");
        assert!(res == "bab" || res == "aba");
    }

    /// Returns 'bb' for s="cbbd"
    #[test]
    fn cbbd_returns_bb() {
        assert_eq!(lps("cbbd"), "bb");
    }

    /// Returns 'a' for s="a"
    #[test]
    fn single_char_a_returns_a() {
        assert_eq!(lps("a"), "a");
    }

    /// Returns 'aa' for s="aa"
    #[test]
    fn double_a_returns_aa() {
        assert_eq!(lps("aa"), "aa");
    }

    /// Returns '' for empty string
    #[test]
    fn empty_string_returns_empty() {
        assert_eq!(lps(""), "");
    }
}