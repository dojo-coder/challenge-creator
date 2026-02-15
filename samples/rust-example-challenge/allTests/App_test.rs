#[cfg(test)]
mod tests_all {
    use crate::app::longest_palindromic_substring as lps;

    #[test]
    fn babad_returns_bab_or_aba() {
        let res = lps("babad");
        assert!(res == "bab" || res == "aba");
    }

    #[test]
    fn cbbd_returns_bb() {
        assert_eq!(lps("cbbd"), "bb");
    }

    #[test]
    fn a_returns_a() {
        assert_eq!(lps("a"), "a");
    }

    #[test]
    fn aa_returns_aa() {
        assert_eq!(lps("aa"), "aa");
    }

    #[test]
    fn empty_returns_empty() {
        assert_eq!(lps(""), "");
    }

    #[test]
    fn banana_returns_anana() {
        assert_eq!(lps("banana"), "anana");
    }

    #[test]
    fn racecar_returns_racecar() {
        assert_eq!(lps("racecar"), "racecar");
    }

    #[test]
    fn madam_returns_madam() {
        assert_eq!(lps("madam"), "madam");
    }

    #[test]
    fn aaaa_returns_aaaa() {
        assert_eq!(lps("aaaa"), "aaaa");
    }
}