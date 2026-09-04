/* 박주형 포트폴리오 — 테마, 목차, 진행바, 모바일 메뉴 */

(function () {
    "use strict";

    var root = document.documentElement;

    /* ---------- 테마 ---------- */
    var toggle = document.querySelector(".theme-toggle");
    var label = toggle && toggle.querySelector(".theme-toggle__label");
    var stored = null;

    try {
        stored = localStorage.getItem("theme");
    } catch (e) {
        /* 저장소를 쓸 수 없으면 시스템 설정만 따른다 */
    }

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        if (toggle) {
            toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
        }
        if (label) {
            label.textContent = theme === "dark" ? "라이트 모드" : "다크 모드";
        }
    }

    applyTheme(
        stored ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );

    if (toggle) {
        toggle.addEventListener("click", function () {
            var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            applyTheme(next);
            try {
                localStorage.setItem("theme", next);
            } catch (e) {
                /* 저장 실패는 무시 */
            }
        });
    }

    /* ---------- 목차 활성 표시 ---------- */
    var navLinks = Array.prototype.slice.call(
        document.querySelectorAll(".rail__nav a")
    );
    var sections = navLinks
        .map(function (link) {
            return document.querySelector(link.getAttribute("href"));
        })
        .filter(Boolean);

    function setCurrent(id) {
        navLinks.forEach(function (link) {
            if (link.getAttribute("href") === "#" + id) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    if ("IntersectionObserver" in window && sections.length) {
        var visible = {};
        var spy = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    visible[entry.target.id] = entry.isIntersecting;
                });
                for (var i = 0; i < sections.length; i += 1) {
                    if (visible[sections[i].id]) {
                        setCurrent(sections[i].id);
                        break;
                    }
                }
            },
            { rootMargin: "-20% 0px -70% 0px" }
        );
        sections.forEach(function (section) {
            spy.observe(section);
        });
    }

    /* ---------- 읽기 진행바 ---------- */
    var bar = document.querySelector(".progress span");
    if (bar) {
        var ticking = false;
        var update = function () {
            var max = document.body.scrollHeight - window.innerHeight;
            var ratio = max > 0 ? window.scrollY / max : 0;
            bar.style.width = Math.min(1, Math.max(0, ratio)) * 100 + "%";
            ticking = false;
        };
        window.addEventListener(
            "scroll",
            function () {
                if (!ticking) {
                    ticking = true;
                    window.requestAnimationFrame(update);
                }
            },
            { passive: true }
        );
        window.addEventListener("resize", update);
        update();
    }

    /* ---------- 모바일 메뉴 ---------- */
    var rail = document.getElementById("rail");
    var railToggle = document.querySelector(".rail-toggle");

    function closeRail() {
        if (!rail) return;
        rail.classList.remove("is-open");
        if (railToggle) {
            railToggle.setAttribute("aria-expanded", "false");
            railToggle.querySelector(".rail-toggle__label").textContent = "메뉴";
        }
    }

    if (rail && railToggle) {
        railToggle.addEventListener("click", function () {
            var open = rail.classList.toggle("is-open");
            railToggle.setAttribute("aria-expanded", open ? "true" : "false");
            railToggle.querySelector(".rail-toggle__label").textContent = open
                ? "닫기"
                : "메뉴";
        });

        rail.addEventListener("click", function (event) {
            if (event.target.closest("a")) closeRail();
        });

        document.addEventListener("click", function (event) {
            if (
                rail.classList.contains("is-open") &&
                !rail.contains(event.target) &&
                !railToggle.contains(event.target)
            ) {
                closeRail();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") closeRail();
        });
    }
})();
