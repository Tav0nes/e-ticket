# ---- Build stage: bake the DB vendor in so runtime boot is fast ----

FROM quay.io/keycloak/keycloak:26.0 AS builder

ENV KC_DB=postgres
ENV KC_HEALTH_ENABLED=true
RUN /opt/keycloak/bin/kc.sh build

# ---- Runtime stage ----

FROM quay.io/keycloak/keycloak:26.0

COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Auto-import the realm on first boot
COPY realm-export.json /opt/keycloak/data/import/realm-export.json

# Render terminates TLS at its edge and forwards plain HTTP with X-Forwarded-* headers
ENV KC_HTTP_ENABLED=true
ENV KC_PROXY_HEADERS=xforwarded
ENV KC_HOSTNAME_STRICT=false

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start", "--optimized", "--import-realm"]