/*jslint browser: true */

(function () {
    "use strict";

    var afterEach = window.afterEach,
        beforeEach = window.beforeEach,
        BiblicalReference = window.Tikkun.BiblicalReference,
        describe = window.describe,
        expect = window.expect,
        it = window.it;

    describe("Biblical Reference", function () {

        var sut;

        afterEach(function () {
            sut = null;
        });

        describe("when creating a new Biblical Reference with Book 1, Chapter 1, Verse 1, Word 1", function () {
            beforeEach(function () {
                sut = new BiblicalReference(1, 1, 1, 1);
            });

            describe("book", function () {
                it("should be 1", function () {
                    expect(sut.book()).toBe(1);
                });
            });

            describe("chapter", function () {
                it("should be 1", function () {
                    expect(sut.chapter()).toBe(1);
                });
            });

            describe("verse", function () {
                it("should be 1", function () {
                    expect(sut.verse()).toBe(1);
                });
            });

            describe("word", function () {
                it("should be 1", function () {
                    expect(sut.word()).toBe(1);
                });
            });
        });

        describe("when creating a new Biblical Reference with Book 2, Chapter 3, Verse 4, Word 2", function () {
            beforeEach(function () {
                sut = new BiblicalReference(2, 3, 4, 2);
            });

            describe("book", function () {
                it("should be 2", function () {
                    expect(sut.book()).toBe(2);
                });
            });

            describe("chapter", function () {
                it("should be 3", function () {
                    expect(sut.chapter()).toBe(3);
                });
            });

            describe("verse", function () {
                it("should be 4", function () {
                    expect(sut.verse()).toBe(4);
                });
            });

            describe("word", function () {
                it("should be 2", function () {
                    expect(sut.word()).toBe(2);
                });
            });
        });

        describe("when word is not provided", function () {
            describe("word", function () {
                it("should be 1", function () {
                    sut = new BiblicalReference(1, 1, 1);
                    expect(sut.word()).toBe(1);
                });
            });
        });

        describe("isBeforeReference", function () {

            var other;

            describe("reference in the next book", function () {
                it("should return true", function () {
                    sut = new BiblicalReference(1);
                    other = new BiblicalReference(2);

                    expect(sut.isBeforeReference(other)).toBe(true);
                });
            });

            describe("reference in the previous book", function () {
                it("should return true", function () {
                    sut = new BiblicalReference(2);
                    other = new BiblicalReference(1);

                    expect(sut.isBeforeReference(other)).toBe(false);
                });
            });

            describe("reference in same book", function () {
                describe("and next chapter", function () {
                    it("should return true", function () {
                        sut = new BiblicalReference(1, 1);
                        other = new BiblicalReference(1, 2);

                        expect(sut.isBeforeReference(other)).toBe(true);
                    });
                });

                describe("and previous chapter", function () {
                    it("should return false", function () {
                        sut = new BiblicalReference(1, 2);
                        other = new BiblicalReference(1, 1);

                        expect(sut.isBeforeReference(other)).toBe(false);
                    });
                });

                describe("and same chapter", function () {
                    describe("and next verse", function () {
                        it("should return true", function () {
                            sut = new BiblicalReference(1, 1, 1);
                            other = new BiblicalReference(1, 1, 2);

                            expect(sut.isBeforeReference(other)).toBe(true);
                        });
                    });
                    describe("and previous verse", function () {
                        it("should return false", function () {
                            sut = new BiblicalReference(1, 1, 2);
                            other = new BiblicalReference(1, 1, 1);

                            expect(sut.isBeforeReference(other)).toBe(false);
                        });
                    });

                    describe("and same verse", function () {
                        describe("and next word", function () {
                            it("should return true", function () {
                                sut = new BiblicalReference(1, 1, 1, 1);
                                other = new BiblicalReference(1, 1, 1, 2);

                                expect(sut.isBeforeReference(other)).toBe(true);
                            });
                        });

                        describe("and previous word", function () {
                            it("should return false", function () {
                                sut = new BiblicalReference(1, 1, 1, 2);
                                other = new BiblicalReference(1, 1, 1, 1);

                                expect(sut.isBeforeReference(other)).toBe(false);
                            });
                        });
                    });
                });
            });
        });
    });
}());
